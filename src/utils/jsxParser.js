import { parse, parseExpression } from '@babel/parser';

const nativeTags = new Set([
  'a',
  'aside',
  'button',
  'div',
  'footer',
  'form',
  'header',
  'input',
  'label',
  'li',
  'main',
  'ol',
  'option',
  'p',
  'section',
  'select',
  'span',
  'table',
  'tbody',
  'td',
  'textarea',
  'th',
  'thead',
  'tr',
  'ul',
]);

const parserOptions = {
  sourceType: 'module',
  plugins: ['jsx', 'classProperties', 'objectRestSpread'],
  errorRecovery: true,
};

function getJsxName(nameNode) {
  if (!nameNode) return 'Unknown';
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') return getJsxName(nameNode.property);
  if (nameNode.type === 'JSXNamespacedName') return nameNode.name.name;
  return 'Unknown';
}

function parseSource(source) {
  try {
    return parse(source, parserOptions);
  } catch (moduleError) {
    try {
      return parseExpression(source, { plugins: ['jsx'] });
    } catch (expressionError) {
      return {
        type: 'ParseError',
        errors: [moduleError.message, expressionError.message],
      };
    }
  }
}

function walk(node, visitor, context = {}) {
  if (!node || typeof node !== 'object') return;
  visitor(node, context);

  Object.entries(node).forEach(([key, value]) => {
    if (key === 'loc' || key === 'start' || key === 'end') return;
    if (Array.isArray(value)) {
      value.forEach((child) => walk(child, visitor, context));
      return;
    }
    if (value && typeof value === 'object' && value.type) {
      walk(value, visitor, context);
    }
  });
}

function analyzeAttribute(attribute) {
  if (attribute.type !== 'JSXAttribute') return null;
  const name = attribute.name?.name ?? 'unknown';
  const expression = attribute.value?.expression;
  const expressionType = expression?.type;

  if (expressionType === 'ObjectExpression') {
    return { prop: name, type: 'Inline object', severity: 'warning', message: `${name} creates a new object identity on every render.` };
  }
  if (expressionType === 'ArrayExpression') {
    return { prop: name, type: 'Inline array', severity: 'warning', message: `${name} creates a new array identity on every render.` };
  }
  if (expressionType === 'ArrowFunctionExpression' || expressionType === 'FunctionExpression') {
    return { prop: name, type: 'Inline callback', severity: 'warning', message: `${name} creates a new function identity on every render.` };
  }
  if (expressionType === 'Identifier') {
    return { prop: name, type: 'External value', severity: 'info', message: `${name} is passed from the current scope.` };
  }
  return null;
}

export function analyzeJsxSource(source) {
  const ast = parseSource(source);
  if (ast.type === 'ParseError') {
    return {
      components: [],
      edges: [],
      diagnostics: ast.errors.map((error) => ({ type: 'Parse error', severity: 'danger', message: error })),
      score: 0,
      maxDepth: 0,
      inlineRiskCount: 0,
    };
  }

  const componentsByName = new Map();
  const edges = [];
  const diagnostics = [];
  const stack = [];

  function visitJsxElement(node) {
    node.__visitedByRenderFlow = true;
    const name = getJsxName(node.openingElement.name);
    const isNative = nativeTags.has(name);
    const parent = [...stack].reverse().find((item) => !nativeTags.has(item.name));
    const depth = stack.length;

    if (!isNative) {
      const current = componentsByName.get(name) ?? {
        id: name.toLowerCase(),
        name,
        count: 0,
        depth,
        props: [],
        warnings: [],
        parent: parent?.name ?? null,
      };

      current.count += 1;
      current.depth = Math.min(current.depth, depth);
      current.parent = current.parent ?? parent?.name ?? null;

      node.openingElement.attributes.forEach((attribute) => {
        const diagnostic = analyzeAttribute(attribute);
        if (!diagnostic) return;
        current.props.push(diagnostic.prop);
        if (diagnostic.severity === 'warning') {
          current.warnings.push(diagnostic.message);
          diagnostics.push({ component: name, ...diagnostic });
        }
      });

      if (parent) {
        edges.push({ source: parent.name, target: name });
      }

      componentsByName.set(name, current);
    }

    stack.push({ name, isNative });
    node.children.forEach((child) => {
      if (child.type === 'JSXElement') visitJsxElement(child);
      if (child.type === 'JSXFragment') visitJsxFragment(child);
      if (child.type === 'JSXExpressionContainer') {
        walk(child.expression, (nested) => {
          if (nested.type === 'JSXElement') visitJsxElement(nested);
          if (nested.type === 'JSXFragment') visitJsxFragment(nested);
        });
      }
    });
    stack.pop();
  }

  function visitJsxFragment(node) {
    node.__visitedByRenderFlow = true;
    node.children.forEach((child) => {
      if (child.type === 'JSXElement') visitJsxElement(child);
      if (child.type === 'JSXFragment') visitJsxFragment(child);
    });
  }

  walk(ast, (node) => {
    if (node.type === 'JSXElement' && !node.__visitedByRenderFlow) {
      node.__visitedByRenderFlow = true;
      visitJsxElement(node);
    }
    if (node.type === 'JSXFragment' && !node.__visitedByRenderFlow) {
      node.__visitedByRenderFlow = true;
      visitJsxFragment(node);
    }
  });

  const components = [...componentsByName.values()].map((component, index) => ({
    ...component,
    depthLabel: component.depth === 0 || index === 0 ? 'root' : component.depth <= 2 ? 'section' : 'leaf',
    warning: component.warnings[0] ?? (component.parent ? `Child of ${component.parent}. Review prop ownership.` : 'Likely composition boundary.'),
    props: [...new Set(component.props)],
    warnings: [...new Set(component.warnings)],
  }));

  const maxDepth = components.reduce((max, component) => Math.max(max, component.depth), 0);
  const inlineRiskCount = diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length;
  const score = scoreImportedTree(components, { maxDepth, inlineRiskCount });

  return {
    components,
    edges,
    diagnostics,
    score,
    maxDepth,
    inlineRiskCount,
  };
}

export function extractComponentsFromJsx(source) {
  return analyzeJsxSource(source).components;
}

export function scoreImportedTree(components, meta = {}) {
  if (!components.length) return 0;
  const depthPenalty = Math.max(0, (meta.maxDepth ?? components.length) - 4) * 5;
  const inlinePenalty = (meta.inlineRiskCount ?? 0) * 7;
  const sizePenalty = Math.max(0, components.length - 8) * 3;
  return Math.max(28, Math.min(94, 92 - depthPenalty - inlinePenalty - sizePenalty));
}
