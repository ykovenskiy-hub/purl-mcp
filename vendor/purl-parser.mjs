// src/utils/script/tokenizer.ts
var KEYWORDS = [
  "if",
  "else",
  "goto",
  "transition",
  "show",
  "hide",
  "wait",
  "sync",
  "set",
  "reset",
  "enable",
  "disable",
  "restart",
  "then",
  "and",
  "or",
  "not",
  "mod",
  "true",
  "false",
  "clear",
  "cell",
  "onenter",
  "onexit",
  "onclick",
  "onmessage",
  "onmessagefrom",
  "onkeydown",
  "onkeyup",
  "onoverlap",
  "onoverlapend",
  "oncollide",
  "onhover",
  "onhoverend",
  "onmove",
  "onstop",
  "onjump",
  "onlanding",
  "with",
  "next",
  "prev",
  "pageable",
  "movable",
  "jumpable",
  "wrap",
  "all",
  "any",
  "count",
  "action",
  "self",
  "other",
  "parent",
  "siblings",
  "children",
  "shout",
  "to",
  "script",
  "post",
  "fetch",
  "into",
  "first",
  "where",
  "foreach",
  "repeat",
  "in",
  "is",
  "log",
  "shake",
  "vibrate",
  "pulse",
  "squeeze",
  "bounce",
  "spin",
  "glow",
  "screenshake",
  "stop",
  "loop",
  "horizontal",
  "vertical",
  "cw",
  "ccw",
  "input",
  "subject",
  "keyboard",
  "click",
  "gamepad",
  "drag",
  "mouse",
  "physics",
  "spawn",
  "destroy",
  "onspawn",
  "ondestroy",
  "return",
  "break",
  "draggable",
  "ondragstart",
  "ondrag",
  "ondragend",
  "once",
  "collision",
  "discrete",
  "copy",
  "animate",
  "fps",
  "pingpong",
  "duration",
  "over",
  "resume",
  "exclusive",
  "reverse",
  "do",
  "play",
  "pause",
  "jump",
  "impulse",
  "fresh",
  "clean",
  "reveal",
  "rehide",
  "transport",
  "screen",
  "moveto",
  "at",
  "save",
  "load",
  "delete",
  "endgame",
  "press",
  "release"
];
var ANIMATION_KEYWORDS = ["shake", "vibrate", "pulse", "squeeze", "bounce", "spin", "glow"];
var TYPE_SELECTORS = {
  // Object types (plural)
  "text": "text",
  "shapes": "shape",
  "lines": "line",
  "grids": "grid",
  "components": "component",
  // Shape types (plural)
  "rectangles": "polygon",
  // Legacy alias
  "circles": "circle",
  "ellipses": "ellipse",
  "polygons": "polygon",
  // Singular forms also work
  "shape": "shape",
  "line": "line",
  "grid": "grid",
  "component": "component",
  "rectangle": "polygon",
  // Legacy alias
  "circle": "circle",
  "ellipse": "ellipse",
  "polygon": "polygon"
};
var OPERATORS = [">=", "<=", "==", "!=", ">", "<", "+", "-", "*", "/", "%", "(", ")", ":"];
function tokenize(source) {
  const tokens = [];
  const lines = source.split("\n");
  const indentStack = [0];
  let braceDepth = 0;
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("//") || trimmed.startsWith("#")) {
      continue;
    }
    const indent = line.length - line.trimStart().length;
    const currentIndent = indentStack[indentStack.length - 1];
    if (braceDepth === 0) {
      if (indent > currentIndent) {
        indentStack.push(indent);
        tokens.push({ type: "INDENT", value: "", line: lineNum, column: 0 });
      } else if (indent < currentIndent) {
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
          indentStack.pop();
          tokens.push({ type: "DEDENT", value: "", line: lineNum, column: 0 });
        }
      }
    }
    let col = indent;
    const content = line.slice(indent);
    let i = 0;
    while (i < content.length) {
      const char = content[i];
      const rest = content.slice(i);
      if (char === "/" && content[i + 1] === "/") {
        break;
      }
      if (char === "#") {
        const nextChar = content[i + 1];
        if (nextChar && /[a-zA-Z_]/.test(nextChar)) {
          i++;
          col++;
          let tagName = "";
          while (i < content.length && /[a-zA-Z0-9_]/.test(content[i])) {
            tagName += content[i];
            i++;
            col++;
          }
          tokens.push({ type: "TAG", value: tagName, line: lineNum, column: col - tagName.length });
          continue;
        } else {
          break;
        }
      }
      if (char === " " || char === "	") {
        i++;
        col++;
        continue;
      }
      if (char === '"' || char === "'") {
        const quote = char;
        let str = "";
        i++;
        col++;
        while (i < content.length && content[i] !== quote) {
          str += content[i];
          i++;
          col++;
        }
        i++;
        col++;
        tokens.push({ type: "STRING", value: str, line: lineNum, column: col - str.length - 2 });
        continue;
      }
      if (/\d/.test(char)) {
        let num = "";
        while (i < content.length && /[\d.]/.test(content[i])) {
          num += content[i];
          i++;
          col++;
        }
        if (content[i] === "s") {
          num += "s";
          i++;
          col++;
        } else if (rest.slice(num.length).startsWith("ms")) {
          num += "ms";
          i += 2;
          col += 2;
        }
        tokens.push({ type: "NUMBER", value: num, line: lineNum, column: col - num.length });
        continue;
      }
      if (char === ".") {
        tokens.push({ type: "DOT", value: ".", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === "@") {
        tokens.push({ type: "AT", value: "@", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === "[") {
        tokens.push({ type: "LBRACKET", value: "[", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === "]") {
        tokens.push({ type: "RBRACKET", value: "]", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === "{") {
        braceDepth++;
        tokens.push({ type: "LBRACE", value: "{", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
        tokens.push({ type: "RBRACE", value: "}", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      if (char === ",") {
        tokens.push({ type: "COMMA", value: ",", line: lineNum, column: col });
        i++;
        col++;
        continue;
      }
      let foundOp = false;
      for (const op of OPERATORS) {
        if (rest.startsWith(op)) {
          if (op === "(") {
            tokens.push({ type: "LPAREN", value: op, line: lineNum, column: col });
          } else if (op === ")") {
            tokens.push({ type: "RPAREN", value: op, line: lineNum, column: col });
          } else if (op === ":") {
            tokens.push({ type: "COLON", value: op, line: lineNum, column: col });
          } else {
            tokens.push({ type: "OPERATOR", value: op, line: lineNum, column: col });
          }
          i += op.length;
          col += op.length;
          foundOp = true;
          break;
        }
      }
      if (foundOp) continue;
      if (/[a-zA-Z_-]/.test(char)) {
        let ident = "";
        while (i < content.length && /[a-zA-Z0-9_-]/.test(content[i])) {
          ident += content[i];
          i++;
          col++;
        }
        const lower = ident.toLowerCase();
        if (KEYWORDS.includes(lower)) {
          tokens.push({ type: "KEYWORD", value: lower, line: lineNum, column: col - ident.length });
        } else {
          tokens.push({ type: "IDENTIFIER", value: ident, line: lineNum, column: col - ident.length });
        }
        continue;
      }
      i++;
      col++;
    }
    tokens.push({ type: "NEWLINE", value: "", line: lineNum, column: col });
  }
  while (indentStack.length > 1) {
    indentStack.pop();
    tokens.push({ type: "DEDENT", value: "", line: lines.length - 1, column: 0 });
  }
  tokens.push({ type: "EOF", value: "", line: lines.length, column: 0 });
  return tokens;
}

// src/utils/script/parsers/expressions.ts
function parseExpression(ctx) {
  return parseOr(ctx);
}
function parseOr(ctx) {
  let left = parseAnd(ctx);
  while (ctx.check("KEYWORD") && ctx.peek().value === "or") {
    ctx.advance();
    const right = parseAnd(ctx);
    left = { type: "binary", operator: "or", left, right };
  }
  return left;
}
function parseAnd(ctx) {
  let left = parseComparison(ctx);
  while (ctx.check("KEYWORD") && ctx.peek().value === "and") {
    ctx.advance();
    const right = parseComparison(ctx);
    left = { type: "binary", operator: "and", left, right };
  }
  return left;
}
function parseComparison(ctx) {
  let left = parseAdditive(ctx);
  const ops = [">", "<", ">=", "<=", "==", "!="];
  while (ctx.check("OPERATOR") && ops.includes(ctx.peek().value)) {
    const op = ctx.advance().value;
    const right = parseAdditive(ctx);
    left = { type: "binary", operator: op, left, right };
  }
  if (ctx.check("KEYWORD") && ctx.peek().value === "is") {
    ctx.advance();
    if (ctx.check("TAG")) {
      const tagName = ctx.advance().value;
      const right = { type: "tag", name: tagName };
      left = { type: "binary", operator: "is", left, right };
    } else {
      ctx.error("Expected tag after 'is' (e.g., 'is #enemy')");
    }
  }
  return left;
}
function parseAdditive(ctx) {
  let left = parseMultiplicative(ctx);
  while (ctx.check("OPERATOR") && ["+", "-"].includes(ctx.peek().value)) {
    const op = ctx.advance().value;
    const right = parseMultiplicative(ctx);
    left = { type: "binary", operator: op, left, right };
  }
  return left;
}
function parseMultiplicative(ctx) {
  let left = parseUnary(ctx);
  while (ctx.check("OPERATOR") && ["*", "/", "%"].includes(ctx.peek().value) || ctx.check("KEYWORD") && ctx.peek().value === "mod") {
    const token = ctx.advance();
    const op = token.value === "mod" ? "mod" : token.value;
    const right = parseUnary(ctx);
    left = { type: "binary", operator: op, left, right };
  }
  return left;
}
function parseUnary(ctx) {
  if (ctx.check("KEYWORD") && ctx.peek().value === "not") {
    ctx.advance();
    const operand = parseUnary(ctx);
    return { type: "unary", operator: "not", operand };
  }
  if (ctx.check("OPERATOR") && ctx.peek().value === "-") {
    ctx.advance();
    const operand = parseUnary(ctx);
    return { type: "unary", operator: "-", operand };
  }
  return parsePrimary(ctx);
}
function parsePrimary(ctx) {
  const token = ctx.peek();
  if (ctx.check("LPAREN")) {
    ctx.advance();
    const expr = parseExpression(ctx);
    ctx.expect("RPAREN");
    return expr;
  }
  if (ctx.check("LBRACKET")) {
    ctx.advance();
    const elements = [];
    if (!ctx.check("RBRACKET")) {
      elements.push(parseExpression(ctx));
      while (ctx.check("COMMA")) {
        ctx.advance();
        if (ctx.check("RBRACKET")) break;
        elements.push(parseExpression(ctx));
      }
    }
    ctx.expect("RBRACKET");
    return { type: "array", elements };
  }
  if (token.type === "KEYWORD" && (token.value === "all" || token.value === "any" || token.value === "count")) {
    const nextToken = ctx.peekNext();
    const isTag = nextToken && nextToken.type === "TAG";
    const isVariable = nextToken && (nextToken.type === "IDENTIFIER" || nextToken.type === "KEYWORD") && nextToken.value !== "and" && nextToken.value !== "or";
    if (isTag || isVariable) {
      const tokenAfterNext = ctx.tokens[ctx.pos + 2];
      if (!isTag && (!tokenAfterNext || tokenAfterNext.type !== "DOT")) {
      } else if (isTag && token.value === "count" && (!tokenAfterNext || tokenAfterNext.type !== "DOT")) {
        ctx.advance();
        const tagToken = ctx.advance();
        const tag = tagToken.value;
        return { type: "aggregate", mode: "count", tag, countOnly: true, property: "", operator: "==", value: { type: "literal", value: true } };
      } else {
        ctx.advance();
        const mode = token.value;
        const tagToken = ctx.advance();
        const tag = tagToken.value;
        const tagIsVariable = !isTag;
        if (!ctx.check("DOT")) {
          ctx.error(`Expected '.' after '${isTag ? "#" + tag : tag}' in aggregate expression`);
          return { type: "literal", value: false };
        }
        ctx.advance();
        const propToken = ctx.peek();
        if (propToken.type !== "IDENTIFIER" && propToken.type !== "KEYWORD") {
          ctx.error(`Expected property name after '${isTag ? "#" + tag : tag}.'`);
          return { type: "literal", value: false };
        }
        ctx.advance();
        const property = propToken.value;
        const opToken = ctx.peek();
        if (opToken.type !== "OPERATOR" || !["==", "!=", ">", "<", ">=", "<="].includes(opToken.value)) {
          ctx.error(`Expected comparison operator after '${isTag ? "#" + tag : tag}.${property}'`);
          return { type: "literal", value: false };
        }
        ctx.advance();
        const operator = opToken.value;
        const value = parsePrimary(ctx);
        return { type: "aggregate", mode, tag, tagIsVariable, property, operator, value };
      }
    }
  }
  if (ctx.check("AT")) {
    ctx.advance();
    const cellName = parseIdentifierOrString(ctx);
    if (!ctx.check("DOT")) {
      ctx.error(`Expected '.' after cell name in @${cellName}`);
      return { type: "literal", value: 0 };
    }
    ctx.advance();
    const objectName = parseIdentifierOrString(ctx);
    if (!ctx.check("DOT")) {
      ctx.error(`Expected '.' after object name in @${cellName}.${objectName}`);
      return { type: "literal", value: 0 };
    }
    ctx.advance();
    const propertyParts = [];
    const firstPropToken = ctx.peek();
    if (firstPropToken.type === "IDENTIFIER" || firstPropToken.type === "KEYWORD") {
      ctx.advance();
      propertyParts.push(firstPropToken.value);
      while (ctx.check("DOT")) {
        const nextToken = ctx.peekNext();
        if (nextToken && (nextToken.type === "IDENTIFIER" || nextToken.type === "KEYWORD")) {
          ctx.advance();
          ctx.advance();
          propertyParts.push(nextToken.value);
        } else {
          break;
        }
      }
      return { type: "property", cell: cellName, object: objectName, property: propertyParts.join(".") };
    } else {
      ctx.error(`Expected property name, got ${firstPropToken.type}`);
      return { type: "literal", value: 0 };
    }
  }
  if (token.type === "TAG") {
    ctx.advance();
    const tagName = token.value;
    if (ctx.check("DOT")) {
      ctx.advance();
      const propToken = ctx.peek();
      if (propToken.type === "IDENTIFIER" || propToken.type === "KEYWORD") {
        ctx.advance();
        return { type: "property", object: `tag:${tagName}`, property: propToken.value };
      }
    }
    return { type: "tag", name: tagName };
  }
  if (token.type === "KEYWORD" && (token.value === "true" || token.value === "false")) {
    ctx.advance();
    return { type: "literal", value: token.value === "true" };
  }
  if (token.type === "NUMBER") {
    ctx.advance();
    let value = token.value;
    if (value.endsWith("ms") || value.endsWith("s")) {
      value = value.replace(/ms|s$/, "");
    }
    return { type: "literal", value: parseFloat(value) };
  }
  if (token.type === "STRING") {
    ctx.advance();
    return { type: "literal", value: token.value };
  }
  if (token.type === "IDENTIFIER" || token.type === "KEYWORD") {
    ctx.advance();
    const name = token.value;
    if (ctx.check("LPAREN")) {
      ctx.advance();
      const args = [];
      while (!ctx.check("RPAREN") && !ctx.isAtEnd()) {
        args.push(parseExpression(ctx));
        if (ctx.check("COMMA")) {
          ctx.advance();
        }
      }
      ctx.expect("RPAREN");
      let result = { type: "function", name, args };
      if (ctx.check("LBRACKET")) {
        ctx.advance();
        const index = parseExpression(ctx);
        ctx.expect("RBRACKET");
        let property;
        if (ctx.check("DOT")) {
          ctx.advance();
          const propToken = ctx.peek();
          if (propToken.type === "IDENTIFIER" || propToken.type === "KEYWORD") {
            ctx.advance();
            property = propToken.value;
          }
        }
        result = { type: "index", array: result, index, property };
      }
      return result;
    }
    if (ctx.check("LBRACKET")) {
      ctx.advance();
      const index = parseExpression(ctx);
      ctx.expect("RBRACKET");
      let property;
      if (ctx.check("DOT")) {
        ctx.advance();
        const propToken = ctx.peek();
        if (propToken.type === "IDENTIFIER" || propToken.type === "KEYWORD") {
          ctx.advance();
          property = propToken.value;
        }
      }
      return { type: "index", array: { type: "get", key: name }, index, property };
    }
    if (ctx.check("DOT")) {
      const nextToken = ctx.peekNext();
      if (nextToken && nextToken.value === "cell") {
        const tokenAfterCell = ctx.tokens[ctx.pos + 2];
        if (tokenAfterCell && tokenAfterCell.type === "LBRACKET") {
          const gridName = name;
          ctx.advance();
          ctx.advance();
          ctx.expect("LBRACKET");
          const xExpr = parseExpression(ctx);
          ctx.expect("RBRACKET");
          ctx.expect("LBRACKET");
          const yExpr = parseExpression(ctx);
          ctx.expect("RBRACKET");
          let property;
          if (ctx.check("DOT")) {
            ctx.advance();
            const propToken = ctx.peek();
            if (propToken.type === "IDENTIFIER" || propToken.type === "KEYWORD") {
              ctx.advance();
              property = propToken.value;
            }
          }
          return { type: "grid-cell", gridName, x: xExpr, y: yExpr, property };
        }
      }
      const knownScopes = ["session", "game", "local"];
      if (knownScopes.includes(name)) {
        ctx.advance();
        const varToken = ctx.peek();
        if (varToken.type === "IDENTIFIER" || varToken.type === "KEYWORD") {
          ctx.advance();
          return { type: "get", key: `${name}.${varToken.value}` };
        }
      }
      const parts = [name];
      while (ctx.check("DOT")) {
        ctx.advance();
        const token2 = ctx.peek();
        if (token2.type === "IDENTIFIER" || token2.type === "KEYWORD") {
          ctx.advance();
          parts.push(token2.value);
        } else {
          ctx.error(`Expected identifier after '.', got ${token2.type}`);
          break;
        }
      }
      if (parts.length >= 2) {
        const statesIndex = parts.indexOf("states");
        if (statesIndex >= 1 && parts.length >= statesIndex + 3) {
          const object2 = parts.slice(0, statesIndex).join(".");
          const property2 = parts.slice(statesIndex).join(".");
          return { type: "property", object: object2, property: property2 };
        }
        const FILL_LAYER_TYPES = ["color", "image", "gradient", "pattern", "noise", "fill"];
        if (parts.length >= 3 && FILL_LAYER_TYPES.includes(parts[parts.length - 2])) {
          const property2 = parts.slice(-2).join(".");
          const object2 = parts.slice(0, -2).join(".");
          return { type: "property", object: object2, property: property2 };
        }
        const property = parts.pop();
        const object = parts.join(".");
        return { type: "property", object, property };
      }
    }
    return { type: "get", key: name };
  }
  ctx.error(`Unexpected token in expression: ${token.value}`);
  ctx.advance();
  return { type: "literal", value: 0 };
}
function parseIdentifierOrString(ctx) {
  const token = ctx.peek();
  if (token.type === "STRING") {
    ctx.advance();
    return token.value;
  }
  if (token.type === "IDENTIFIER" || token.type === "KEYWORD") {
    ctx.advance();
    return token.value;
  }
  ctx.error(`Expected identifier or string, got ${token.type}`);
  return "";
}
function parseCellScopedTarget(ctx) {
  if (ctx.check("AT")) {
    ctx.advance();
    const cellName = parseIdentifierOrString(ctx);
    if (ctx.check("DOT")) {
      ctx.advance();
      const objectName = parseIdentifierOrString(ctx);
      return { cell: cellName, target: objectName };
    } else {
      ctx.error(`Expected '.' after cell name in @${cellName}`);
      return { cell: cellName, target: "" };
    }
  }
  const target = parseIdentifierOrString(ctx);
  return { target };
}

// src/utils/script/parsers/controlFlow.ts
function parseBlock(ctx, consumeColon = true) {
  const statements = [];
  if (consumeColon) {
    ctx.skipOptional("COLON");
  }
  if (ctx.check("LBRACE")) {
    ctx.advance();
    ctx.skipNewlines();
    while (!ctx.check("RBRACE") && !ctx.isAtEnd()) {
      ctx.skipNewlines();
      if (ctx.check("RBRACE") || ctx.isAtEnd()) break;
      const stmt2 = ctx.parseStatement();
      if (stmt2) statements.push(stmt2);
      ctx.skipNewlines();
    }
    if (ctx.check("RBRACE")) {
      ctx.advance();
    } else {
      ctx.error("Expected } to close block");
    }
    return statements;
  }
  ctx.skipNewlines();
  if (ctx.check("INDENT")) {
    ctx.advance();
    while (!ctx.check("DEDENT") && !ctx.isAtEnd()) {
      ctx.skipNewlines();
      if (ctx.check("DEDENT") || ctx.isAtEnd()) break;
      const stmt2 = ctx.parseStatement();
      if (stmt2) statements.push(stmt2);
      ctx.skipNewlines();
    }
    if (ctx.check("DEDENT")) ctx.advance();
    return statements;
  }
  const stmt = ctx.parseStatement();
  if (stmt) statements.push(stmt);
  return statements;
}
function parseIf(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "if");
  const condition = parseExpression(ctx);
  const thenBranch = parseBlock(ctx);
  ctx.skipNewlines();
  let elseBranch;
  if (ctx.check("KEYWORD") && ctx.peek().value === "else") {
    ctx.advance();
    if (ctx.check("KEYWORD") && ctx.peek().value === "if") {
      const elseIfStmt = parseIf(ctx);
      elseBranch = [elseIfStmt];
    } else {
      elseBranch = parseBlock(ctx);
    }
  }
  return { type: "if", condition, then: thenBranch, else: elseBranch, loc: startLoc };
}
function parseFirst(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "first");
  let tag;
  let tagIsVariable = false;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    tag = tagToken.value;
  } else if (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const varToken = ctx.advance();
    tag = varToken.value;
    tagIsVariable = true;
  } else {
    ctx.error('Expected #tag or variable name after "first"');
    return { type: "first", tag: "", property: "", operator: "==", value: { type: "literal", value: "" }, body: [], loc: startLoc };
  }
  if (!ctx.check("KEYWORD") || ctx.peek().value !== "where") {
    ctx.error('Expected "where" after tag in first statement');
    return { type: "first", tag, tagIsVariable, property: "", operator: "==", value: { type: "literal", value: "" }, body: [], loc: startLoc };
  }
  ctx.advance();
  if (ctx.check("DOT")) {
    ctx.advance();
  }
  const propToken = ctx.peek();
  if (propToken.type !== "IDENTIFIER" && propToken.type !== "KEYWORD") {
    ctx.error('Expected property name after "."');
    return { type: "first", tag, property: "", operator: "==", value: { type: "literal", value: "" }, body: [], loc: startLoc };
  }
  ctx.advance();
  const property = propToken.value;
  const opToken = ctx.peek();
  const validOps = ["==", "!=", ">", "<", ">=", "<="];
  if (opToken.type !== "OPERATOR" || !validOps.includes(opToken.value)) {
    ctx.error("Expected comparison operator (==, !=, >, <, >=, <=)");
    return { type: "first", tag, property, operator: "==", value: { type: "literal", value: "" }, body: [], loc: startLoc };
  }
  ctx.advance();
  const operator = opToken.value;
  const value = parsePrimary(ctx);
  const body = parseBlock(ctx);
  ctx.skipNewlines();
  let elseBlock;
  if (ctx.check("KEYWORD") && ctx.peek().value === "else") {
    ctx.advance();
    elseBlock = parseBlock(ctx);
  }
  const result = { type: "first", tag, property, operator, value, body, loc: startLoc };
  if (tagIsVariable) result.tagIsVariable = true;
  if (elseBlock && elseBlock.length > 0) result.else = elseBlock;
  return result;
}
function parseForeach(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "foreach");
  const varToken = ctx.peek();
  if (varToken.type !== "IDENTIFIER") {
    ctx.error('Expected variable name after "foreach"');
    return { type: "foreach", variable: "", array: { type: "array", elements: [] }, body: [], loc: startLoc };
  }
  ctx.advance();
  const variable = varToken.value;
  if (!ctx.check("KEYWORD") || ctx.peek().value !== "in") {
    ctx.error('Expected "in" after variable name in foreach');
    return { type: "foreach", variable, array: { type: "array", elements: [] }, body: [], loc: startLoc };
  }
  ctx.advance();
  const array = parseExpression(ctx);
  const body = parseBlock(ctx);
  return { type: "foreach", variable, array, body, loc: startLoc };
}
function parseRepeat(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "repeat");
  let count;
  if (!ctx.check("COLON") && !ctx.check("LBRACE")) {
    count = parseExpression(ctx);
  }
  const body = parseBlock(ctx);
  return { type: "repeat", count, body, loc: startLoc };
}

// src/types/script.ts
var DEFAULT_TRANSITION_DURATION = 300;
var INITIAL_CAMERA_STATE = {
  offsetX: 0,
  offsetY: 0,
  targetOffsetX: 0,
  targetOffsetY: 0,
  followObjectId: null
};
var INITIAL_GAME_STATE = {
  variables: {
    session: {},
    game: {},
    local: {}
  },
  visitedCells: /* @__PURE__ */ new Set(),
  visitCounts: {},
  propertyOverrides: {},
  clickIndices: {},
  pageables: {},
  gridCellData: {},
  camera: { ...INITIAL_CAMERA_STATE }
};
var GOTO_TRANSITIONS = ["fade", "slide-left", "slide-right", "slide-up", "slide-down", "zoom"];
var VISIBILITY_TRANSITIONS = ["fade", "slide-up", "slide-down", "scale"];

// src/utils/script/parsers/navigation.ts
function parseTransition(ctx, validTypes) {
  if (!ctx.check("KEYWORD") || ctx.peek().value !== "with") {
    return void 0;
  }
  ctx.advance();
  const typeToken = ctx.peek();
  if (typeToken.type !== "IDENTIFIER" && typeToken.type !== "KEYWORD") {
    ctx.error(`Expected transition type after 'with', got ${typeToken.type}`);
    return void 0;
  }
  const transitionType = typeToken.value.toLowerCase();
  ctx.advance();
  if (!validTypes.includes(transitionType)) {
    ctx.error(`Unknown transition type '${transitionType}'. Valid types: ${validTypes.join(", ")}`);
  }
  let duration = DEFAULT_TRANSITION_DURATION;
  let durationExpr;
  if (ctx.check("NUMBER")) {
    const durationToken = ctx.advance();
    const value = durationToken.value;
    if (value.endsWith("ms")) {
      duration = parseFloat(value.slice(0, -2));
    } else if (value.endsWith("s")) {
      duration = parseFloat(value.slice(0, -1)) * 1e3;
    } else {
      duration = parseFloat(value);
    }
  } else if (ctx.check("IDENTIFIER") || ctx.check("LPAREN")) {
    durationExpr = parseExpression(ctx);
  }
  const result = { type: transitionType, duration };
  if (durationExpr) result.durationExpr = durationExpr;
  return result;
}
function parseGoto(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "goto");
  const parseResetLevel = () => {
    if (ctx.check("KEYWORD") && (ctx.peek().value === "clean" || ctx.peek().value === "fresh")) {
      return ctx.advance().value;
    }
    return void 0;
  };
  const nextToken = ctx.peek();
  const directions = ["north", "east", "south", "west"];
  if (nextToken.type === "IDENTIFIER" && directions.includes(nextToken.value.toLowerCase())) {
    ctx.advance();
    const direction = nextToken.value.toLowerCase();
    const resetLevel2 = parseResetLevel();
    const transition2 = parseTransition(ctx, GOTO_TRANSITIONS);
    return { type: "goto", direction, resetLevel: resetLevel2, transition: transition2, loc: startLoc };
  }
  const target = parseIdentifierOrString(ctx);
  const resetLevel = parseResetLevel();
  const transition = parseTransition(ctx, GOTO_TRANSITIONS);
  return { type: "goto", target, resetLevel, transition, loc: startLoc };
}
function parseNext(ctx) {
  ctx.expect("KEYWORD", "next");
  const target = parseIdentifierOrString(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  let wrap = false;
  if (ctx.check("KEYWORD") && ctx.peek().value === "wrap") {
    ctx.advance();
    wrap = true;
  }
  let elseStmts;
  if (ctx.check("KEYWORD") && ctx.peek().value === "else") {
    ctx.advance();
    elseStmts = parseBlock(ctx);
  }
  const result = { type: "next", target };
  if (transition) result.transition = transition;
  if (wrap) result.wrap = true;
  if (elseStmts && elseStmts.length > 0) result.else = elseStmts;
  return result;
}
function parsePrev(ctx) {
  ctx.expect("KEYWORD", "prev");
  const target = parseIdentifierOrString(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  let wrap = false;
  if (ctx.check("KEYWORD") && ctx.peek().value === "wrap") {
    ctx.advance();
    wrap = true;
  }
  let elseStmts;
  if (ctx.check("KEYWORD") && ctx.peek().value === "else") {
    ctx.advance();
    elseStmts = parseBlock(ctx);
  }
  const result = { type: "prev", target };
  if (transition) result.transition = transition;
  if (wrap) result.wrap = true;
  if (elseStmts && elseStmts.length > 0) result.else = elseStmts;
  return result;
}
function parseWrap(ctx) {
  ctx.expect("KEYWORD", "wrap");
  const target = parseIdentifierOrString(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  const result = { type: "wrap", target };
  if (transition) result.transition = transition;
  return result;
}
function parseCellTransition(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "transition");
  if (ctx.check("KEYWORD") && ctx.peek().value === "with") {
    ctx.advance();
  }
  const typeToken = ctx.peek();
  if (typeToken.type !== "IDENTIFIER" && typeToken.type !== "KEYWORD") {
    ctx.error(`Expected transition type (fade, slide-up, slide-down, slide-left, slide-right, zoom), got ${typeToken.type}`);
    return { type: "cell-transition", transition: "fade", duration: DEFAULT_TRANSITION_DURATION, loc: startLoc };
  }
  const transitionType = typeToken.value.toLowerCase();
  ctx.advance();
  const validTypes = GOTO_TRANSITIONS;
  if (!validTypes.includes(transitionType)) {
    ctx.error(`Unknown transition type '${transitionType}'. Valid types: ${validTypes.join(", ")}`);
  }
  let duration = DEFAULT_TRANSITION_DURATION;
  if (ctx.check("NUMBER")) {
    const durationToken = ctx.advance();
    const value = durationToken.value;
    if (value.endsWith("ms")) {
      duration = parseFloat(value.slice(0, -2));
    } else if (value.endsWith("s")) {
      duration = parseFloat(value.slice(0, -1)) * 1e3;
    } else {
      duration = parseFloat(value);
    }
  }
  return {
    type: "cell-transition",
    transition: transitionType,
    duration,
    loc: startLoc
  };
}

// src/utils/script/parsers/setStatement.ts
function parseSet(ctx) {
  ctx.expect("KEYWORD", "set");
  if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const typeName = typeToken.value.toLowerCase();
      const resolvedType = TYPE_SELECTORS[typeName];
      if (resolvedType) {
        if (!ctx.check("DOT")) {
          ctx.error(`Expected '.' after type selector 'all ${typeName}'`);
          return { type: "set", key: "", value: { type: "literal", value: 0 } };
        }
        ctx.advance();
        const propertyToken = ctx.peek();
        if (propertyToken.type === "IDENTIFIER" || propertyToken.type === "KEYWORD") {
          ctx.advance();
          const property = propertyToken.value;
          const value2 = parseExpression(ctx);
          const over = parseOverClause(ctx);
          return { type: "set-property", object: `all:${resolvedType}`, property, value: value2, ...over && { duration: over.duration, easing: over.easing } };
        } else {
          ctx.error(`Expected property name after 'all ${typeName}.'`);
          return { type: "set", key: "", value: { type: "literal", value: 0 } };
        }
      } else {
        ctx.error(`Unknown type selector '${typeName}'. Valid types: ${Object.keys(TYPE_SELECTORS).join(", ")}`);
        return { type: "set", key: "", value: { type: "literal", value: 0 } };
      }
    }
  }
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    const tagName = tagToken.value;
    if (!ctx.check("DOT")) {
      ctx.error(`Expected '.' after tag selector '#${tagName}'`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
    ctx.advance();
    const propertyToken = ctx.peek();
    if (propertyToken.type === "IDENTIFIER" || propertyToken.type === "KEYWORD") {
      ctx.advance();
      const property = propertyToken.value;
      const value2 = parseExpression(ctx);
      const over = parseOverClause(ctx);
      return { type: "set-property", object: `tag:${tagName}`, property, value: value2, ...over && { duration: over.duration, easing: over.easing } };
    } else {
      ctx.error(`Expected property name after '#${tagName}.'`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
  }
  if (ctx.check("DOT")) {
    ctx.advance();
    const propertyToken = ctx.peek();
    if (propertyToken.type === "IDENTIFIER" || propertyToken.type === "KEYWORD") {
      ctx.advance();
      const property = propertyToken.value;
      const value2 = parseExpression(ctx);
      const over = parseOverClause(ctx);
      return { type: "set-property", object: "", property, value: value2, ...over && { duration: over.duration, easing: over.easing } };
    } else {
      ctx.error(`Expected property name after '.'`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
  }
  if (ctx.check("AT")) {
    ctx.advance();
    const cellName = parseIdentifierOrString(ctx);
    if (!ctx.check("DOT")) {
      ctx.error(`Expected '.' after cell name in @${cellName}`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
    ctx.advance();
    const objectName = parseIdentifierOrString(ctx);
    if (!ctx.check("DOT")) {
      ctx.error(`Expected '.' after object name in @${cellName}.${objectName}`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
    ctx.advance();
    const propertyToken = ctx.peek();
    if (propertyToken.type === "IDENTIFIER" || propertyToken.type === "KEYWORD") {
      ctx.advance();
      const property = propertyToken.value;
      const value2 = parseExpression(ctx);
      if (property === "state") {
        const STATE_MODIFIERS = /* @__PURE__ */ new Set(["none", "position", "rotate", "scale"]);
        const modifiers = [];
        while (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
          const modToken = ctx.peek();
          if ((modToken.type === "IDENTIFIER" || modToken.type === "KEYWORD") && STATE_MODIFIERS.has(modToken.value.toLowerCase())) {
            modifiers.push(modToken.value.toLowerCase());
            ctx.advance();
          } else {
            break;
          }
        }
        const over = parseOverClause(ctx);
        if (modifiers.length > 0 || over) {
          return { type: "set-state", cell: cellName, object: objectName, value: value2, modifiers, ...over && { duration: over.duration, easing: over.easing, rotationDirection: over.rotationDirection } };
        }
      }
      const crossOver = parseOverClause(ctx);
      return { type: "set-property", cell: cellName, object: objectName, property, value: value2, ...crossOver && { duration: crossOver.duration, easing: crossOver.easing } };
    } else {
      ctx.error(`Expected property name, got ${propertyToken.type}`);
      return { type: "set", key: "", value: { type: "literal", value: 0 } };
    }
  }
  const firstPart = parseIdentifierOrString(ctx);
  if (ctx.check("DOT")) {
    const nextToken = ctx.peekNext();
    if (nextToken && nextToken.value === "cell") {
      const tokenAfterCell = ctx.tokens[ctx.pos + 2];
      if (tokenAfterCell && tokenAfterCell.type === "LBRACKET") {
        const gridName = firstPart;
        ctx.advance();
        ctx.advance();
        ctx.expect("LBRACKET");
        const xExpr = parseExpression(ctx);
        ctx.expect("RBRACKET");
        ctx.expect("LBRACKET");
        const yExpr = parseExpression(ctx);
        ctx.expect("RBRACKET");
        if (!ctx.check("DOT")) {
          ctx.error(`Expected '.property' after Grid.cell[x][y] in set statement`);
          return { type: "set", key: "", value: { type: "literal", value: 0 } };
        }
        ctx.advance();
        const propToken = ctx.peek();
        if (propToken.type !== "IDENTIFIER" && propToken.type !== "KEYWORD") {
          ctx.error(`Expected property name after Grid.cell[x][y].`);
          return { type: "set", key: "", value: { type: "literal", value: 0 } };
        }
        ctx.advance();
        const property = propToken.value;
        const value2 = parseExpression(ctx);
        return { type: "set-grid-cell", gridName, x: xExpr, y: yExpr, property, value: value2 };
      }
    }
  }
  const VARIABLE_SCOPES = ["session", "game", "local"];
  if (ctx.check("DOT") && VARIABLE_SCOPES.includes(firstPart)) {
    ctx.advance();
    const varNameToken = ctx.peek();
    if (varNameToken.type === "IDENTIFIER" || varNameToken.type === "KEYWORD") {
      ctx.advance();
      const varName = varNameToken.value;
      const value2 = parseExpression(ctx);
      return { type: "set", key: `${firstPart}.${varName}`, value: value2 };
    }
  }
  if (ctx.check("DOT")) {
    const parts = [firstPart];
    while (ctx.check("DOT")) {
      ctx.advance();
      const token = ctx.peek();
      if (token.type === "IDENTIFIER" || token.type === "KEYWORD") {
        ctx.advance();
        parts.push(token.value);
      } else {
        ctx.error(`Expected identifier after '.', got ${token.type}`);
        break;
      }
    }
    if (parts.length >= 2) {
      const FILL_LAYER_TYPES = ["color", "image", "gradient", "pattern", "noise", "fill"];
      if (parts.length >= 3 && FILL_LAYER_TYPES.includes(parts[parts.length - 2])) {
        const property2 = parts.slice(-2).join(".");
        const object2 = parts.slice(0, -2).join(".");
        const value3 = parseExpression(ctx);
        const over2 = parseOverClause(ctx);
        return { type: "set-property", object: object2, property: property2, value: value3, ...over2 && { duration: over2.duration, easing: over2.easing } };
      }
      const property = parts.pop();
      const object = parts.join(".");
      const value2 = parseExpression(ctx);
      if (property === "state") {
        const STATE_MODIFIERS = /* @__PURE__ */ new Set(["none", "position", "rotate", "scale"]);
        const modifiers = [];
        while (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
          const modToken = ctx.peek();
          if ((modToken.type === "IDENTIFIER" || modToken.type === "KEYWORD") && STATE_MODIFIERS.has(modToken.value.toLowerCase())) {
            modifiers.push(modToken.value.toLowerCase());
            ctx.advance();
          } else {
            break;
          }
        }
        const over2 = parseOverClause(ctx);
        if (modifiers.length > 0 || over2) {
          return { type: "set-state", object, value: value2, modifiers, ...over2 && { duration: over2.duration, easing: over2.easing, rotationDirection: over2.rotationDirection } };
        }
      }
      const over = parseOverClause(ctx);
      return { type: "set-property", object, property, value: value2, ...over && { duration: over.duration, easing: over.easing } };
    }
  }
  const value = parseExpression(ctx);
  return { type: "set", key: firstPart, value };
}
function parseReset(ctx) {
  ctx.expect("KEYWORD", "reset");
  if (ctx.check("KEYWORD") && ctx.peek().value === "script") {
    ctx.advance();
    return { type: "resetscript" };
  }
  let scope = parseIdentifierOrString(ctx);
  if (scope === "cell") {
    scope = "visits";
  }
  return { type: "reset", scope };
}
function parseRestart(ctx) {
  ctx.expect("KEYWORD", "restart");
  return { type: "restart" };
}
function parseEndGame(ctx) {
  ctx.expect("KEYWORD", "endgame");
  return { type: "endGame" };
}
function parseReturn(ctx) {
  const token = ctx.peek();
  ctx.expect("KEYWORD", "return");
  return { type: "return", loc: { line: token.line + 1 } };
}
function parseBreak(ctx) {
  const token = ctx.peek();
  ctx.expect("KEYWORD", "break");
  return { type: "break", loc: { line: token.line + 1 } };
}
function parseSave(ctx) {
  ctx.expect("KEYWORD", "save");
  const slotName = parseIdentifierOrString(ctx);
  return { type: "save", slotName };
}
function parseLoad(ctx) {
  ctx.expect("KEYWORD", "load");
  const slotName = parseIdentifierOrString(ctx);
  return { type: "load", slotName };
}
function parseDeleteSave(ctx) {
  ctx.expect("KEYWORD", "delete");
  ctx.expect("KEYWORD", "save");
  const slotName = parseIdentifierOrString(ctx);
  return { type: "deletesave", slotName };
}
var EASING_NAMES = /* @__PURE__ */ new Set([
  "linear",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "ease-in-cubic",
  "ease-out-cubic",
  "ease-in-out-cubic"
]);
function parseOverClause(ctx) {
  if (ctx.isAtEnd() || ctx.check("NEWLINE") || ctx.check("DEDENT") || ctx.check("RBRACE")) return null;
  if (!ctx.check("KEYWORD") || ctx.peek().value !== "over") return null;
  ctx.advance();
  const duration = parseExpression(ctx);
  let easing;
  let rotationDirection;
  for (let i = 0; i < 2; i++) {
    if (ctx.isAtEnd() || ctx.check("NEWLINE") || ctx.check("DEDENT") || ctx.check("RBRACE")) break;
    const token = ctx.peek();
    if ((token.type === "IDENTIFIER" || token.type === "KEYWORD") && !easing && EASING_NAMES.has(token.value)) {
      easing = ctx.advance().value;
    } else if (token.type === "KEYWORD" && !rotationDirection && (token.value === "cw" || token.value === "ccw")) {
      rotationDirection = ctx.advance().value;
    } else {
      break;
    }
  }
  return { duration, easing, rotationDirection };
}

// src/utils/script/parsers/enableDisable.ts
var CAPABILITY_KEYWORDS = /* @__PURE__ */ new Set([
  "movable",
  "jumpable",
  "draggable",
  "keyboard",
  "click",
  "gamepad",
  "script",
  "subject",
  "pageable",
  "follow",
  "avoid",
  "zone",
  "blocking",
  "sensor",
  "phase"
]);
function parseTarget(ctx) {
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    return `#${tagToken.value}`;
  }
  return parseIdentifierOrString(ctx);
}
function parseEnable(ctx) {
  const startToken = ctx.peek();
  ctx.expect("KEYWORD", "enable");
  const target = parseTarget(ctx);
  const capToken = ctx.peek();
  if (capToken.type !== "KEYWORD" && capToken.type !== "IDENTIFIER" || !CAPABILITY_KEYWORDS.has(capToken.value.toLowerCase())) {
    ctx.error(`Expected capability keyword (movable, jumpable, draggable, keyboard, click, gamepad, script, subject, pageable, follow, avoid, zone, blocking, sensor, phase), got '${capToken.value}'`);
    return { type: "enable", target, capability: "movable", loc: { line: startToken.line + 1 } };
  }
  ctx.advance();
  const rawCapability = capToken.value.toLowerCase();
  const capability = rawCapability === "avoid" ? "follow" : rawCapability;
  const stmt = {
    type: "enable",
    target,
    capability,
    loc: { line: startToken.line + 1 }
  };
  switch (capability) {
    case "movable":
      parseMovableConfig(ctx, stmt);
      break;
    case "jumpable":
      parseJumpableConfig(ctx, stmt);
      break;
    case "draggable":
      parseDraggableConfig(ctx, stmt);
      break;
    case "pageable":
      parsePageableConfig(ctx, stmt);
      break;
    case "follow":
      parseFollowConfig(ctx, stmt, rawCapability === "avoid");
      break;
    case "zone":
      parseZoneConfig(ctx, stmt);
      break;
    case "blocking":
    case "sensor":
    case "phase":
      parseAffectsConfig(ctx, stmt);
      break;
  }
  return stmt;
}
function parseDisable(ctx) {
  const startToken = ctx.peek();
  ctx.expect("KEYWORD", "disable");
  const target = parseTarget(ctx);
  const capToken = ctx.peek();
  if (capToken.type !== "KEYWORD" && capToken.type !== "IDENTIFIER" || !CAPABILITY_KEYWORDS.has(capToken.value.toLowerCase())) {
    ctx.error(`Expected capability keyword (movable, jumpable, draggable, keyboard, click, gamepad, script, subject, pageable, follow, avoid, zone, blocking, sensor, phase), got '${capToken.value}'`);
    return { type: "disable", target, capability: "movable", loc: { line: startToken.line + 1 } };
  }
  ctx.advance();
  const rawCap = capToken.value.toLowerCase();
  const capability = rawCap === "avoid" ? "follow" : rawCap;
  return {
    type: "disable",
    target,
    capability,
    loc: { line: startToken.line + 1 }
  };
}
function parseMovableConfig(ctx, stmt) {
  while (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const configKey = ctx.peek().value.toLowerCase();
    if (configKey === "speed" || configKey === "acceleration" || configKey === "deceleration") {
      ctx.advance();
      stmt[configKey] = parseExpression(ctx);
    } else if (configKey === "style") {
      ctx.advance();
      if (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
        const styleValue = ctx.peek().value.toLowerCase();
        if (styleValue === "teleport" || styleValue === "slide" || styleValue === "fade" || styleValue === "jump") {
          stmt.moveStyle = styleValue;
          ctx.advance();
        }
      }
    } else if (configKey === "axis") {
      ctx.advance();
      if (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
        const axisValue = ctx.peek().value.toLowerCase();
        if (axisValue === "x" || axisValue === "y" || axisValue === "forward") {
          stmt.axis = axisValue;
          ctx.advance();
        }
      }
    } else if (configKey === "steer") {
      ctx.advance();
      stmt.steerRate = parseExpression(ctx);
    } else if (configKey === "path") {
      ctx.advance();
      stmt.pathId = parseExpression(ctx);
    } else if (configKey === "facing") {
      ctx.advance();
      stmt.faceMovement = true;
    } else if (configKey === "traction") {
      ctx.advance();
      stmt.traction = true;
    } else {
      break;
    }
  }
}
function parseJumpableConfig(ctx, stmt) {
  while (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const configKey = ctx.peek().value.toLowerCase();
    if (configKey === "height") {
      ctx.advance();
      stmt.height = parseExpression(ctx);
    } else if (configKey === "key" || configKey === "keys") {
      ctx.advance();
      const value = parseExpression(ctx);
      if (value.type === "literal" && typeof value.value === "string") {
        stmt.keys = [value.value];
      }
    } else if (configKey === "multijump") {
      ctx.advance();
      stmt.multiJump = parseExpression(ctx);
    } else {
      break;
    }
  }
}
function parseDraggableConfig(ctx, stmt) {
  while (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const configKey = ctx.peek().value.toLowerCase();
    if (configKey === "once") {
      ctx.advance();
      stmt.once = true;
    } else if (configKey === "collision") {
      ctx.advance();
      stmt.collision = true;
    } else if (configKey === "discrete") {
      ctx.advance();
      stmt.discrete = true;
    } else if (configKey === "occupy") {
      ctx.advance();
      stmt.occupy = true;
    } else {
      break;
    }
  }
}
function parsePageableConfig(ctx, stmt) {
  const isEndOfStatement = ctx.check("NEWLINE") || ctx.check("DEDENT") || ctx.isAtEnd() || ctx.check("RBRACE");
  if (isEndOfStatement) {
    stmt.items = [];
    stmt.useStructureOrder = true;
    return;
  }
  const hasBrackets = ctx.check("LBRACKET");
  if (hasBrackets) {
    ctx.advance();
  }
  const items = [];
  const endCheck = hasBrackets ? () => ctx.check("RBRACKET") : () => ctx.check("NEWLINE") || ctx.check("DEDENT") || ctx.isAtEnd() || ctx.check("RBRACE");
  while (!endCheck()) {
    const token = ctx.peek();
    if (token.type !== "IDENTIFIER" && token.type !== "STRING" && token.type !== "KEYWORD") {
      break;
    }
    const item = parseIdentifierOrString(ctx);
    if (item) items.push(item);
    if (ctx.check("COMMA")) {
      ctx.advance();
    }
  }
  if (hasBrackets) {
    if (ctx.check("RBRACKET")) {
      ctx.advance();
    } else {
      ctx.error(`Expected ']' to close pageable list`);
    }
  }
  if (items.length === 0) {
    stmt.items = [];
    stmt.useStructureOrder = true;
  } else {
    stmt.items = items;
  }
}
function parseZoneConfig(ctx, stmt) {
  while (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const configKey = ctx.peek().value.toLowerCase();
    if (configKey === "gravity" || configKey === "wind" || configKey === "airresistance" || configKey === "friction" || configKey === "flowx" || configKey === "flowy") {
      ctx.advance();
      const expr = parseExpression(ctx);
      const fieldMap = {
        gravity: "zoneGravity",
        wind: "zoneWind",
        airresistance: "zoneAirResistance",
        friction: "zoneFriction",
        flowx: "zoneFlowX",
        flowy: "zoneFlowY"
      };
      stmt[fieldMap[configKey]] = expr;
    } else if (configKey === "windangle") {
      ctx.advance();
      stmt.zoneWindAngle = parseExpression(ctx);
    } else if (configKey === "affects") {
      ctx.advance();
      const tags = [];
      while (ctx.check("TAG")) {
        tags.push(ctx.advance().value);
      }
      if (tags.length > 0) {
        stmt.zoneAffectTags = tags;
      }
    } else {
      break;
    }
  }
}
function parseAffectsConfig(ctx, stmt) {
  if ((ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) && ctx.peek().value.toLowerCase() === "affects") {
    ctx.advance();
    const tags = [];
    while (ctx.check("TAG")) {
      tags.push(ctx.advance().value);
    }
    if (tags.length > 0) {
      stmt.affectTags = tags;
    }
  }
}
function parseFollowConfig(ctx, stmt, isAvoid) {
  stmt.followAvoid = isAvoid;
  if (ctx.check("STRING") || ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    stmt.followTarget = parseIdentifierOrString(ctx);
  } else {
    ctx.error(`Expected target object name after ${isAvoid ? "avoid" : "follow"}`);
    return;
  }
  while (ctx.check("IDENTIFIER") || ctx.check("KEYWORD")) {
    const configKey = ctx.peek().value.toLowerCase();
    if (configKey === "distance") {
      ctx.advance();
      stmt.followDistance = parseExpression(ctx);
    } else if (configKey === "deadzone") {
      ctx.advance();
      stmt.followDeadZone = parseExpression(ctx);
    } else if (configKey === "arrival") {
      ctx.advance();
      stmt.followArrival = parseExpression(ctx);
    } else if (configKey === "delay") {
      ctx.advance();
      stmt.followDelay = parseExpression(ctx);
    } else if (configKey === "pathfinding") {
      ctx.advance();
      stmt.followPathfinding = true;
    } else {
      break;
    }
  }
}

// src/utils/script/parsers/actions.ts
function parseShow(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "show");
  if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const typeName = typeToken.value.toLowerCase();
      const resolvedType = TYPE_SELECTORS[typeName];
      if (resolvedType) {
        const target2 = `all:${resolvedType}`;
        const transition2 = parseTransition(ctx, VISIBILITY_TRANSITIONS);
        return transition2 ? { type: "show", target: target2, transition: transition2, loc: startLoc } : { type: "show", target: target2, loc: startLoc };
      } else {
        ctx.error(`Unknown type selector '${typeName}'. Valid types: ${Object.keys(TYPE_SELECTORS).join(", ")}`);
        return { type: "show", target: "", loc: startLoc };
      }
    }
  }
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    const target2 = `tag:${tagToken.value}`;
    const transition2 = parseTransition(ctx, VISIBILITY_TRANSITIONS);
    return transition2 ? { type: "show", target: target2, transition: transition2, loc: startLoc } : { type: "show", target: target2, loc: startLoc };
  }
  const { cell, target } = parseCellScopedTarget(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  const result = { type: "show", target, loc: startLoc };
  if (cell) result.cell = cell;
  if (transition) result.transition = transition;
  return result;
}
function parseHide(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "hide");
  if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const typeName = typeToken.value.toLowerCase();
      const resolvedType = TYPE_SELECTORS[typeName];
      if (resolvedType) {
        const target2 = `all:${resolvedType}`;
        const transition2 = parseTransition(ctx, VISIBILITY_TRANSITIONS);
        return transition2 ? { type: "hide", target: target2, transition: transition2, loc: startLoc } : { type: "hide", target: target2, loc: startLoc };
      } else {
        ctx.error(`Unknown type selector '${typeName}'. Valid types: ${Object.keys(TYPE_SELECTORS).join(", ")}`);
        return { type: "hide", target: "", loc: startLoc };
      }
    }
  }
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    const target2 = `tag:${tagToken.value}`;
    const transition2 = parseTransition(ctx, VISIBILITY_TRANSITIONS);
    return transition2 ? { type: "hide", target: target2, transition: transition2, loc: startLoc } : { type: "hide", target: target2, loc: startLoc };
  }
  const { cell, target } = parseCellScopedTarget(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  const result = { type: "hide", target, loc: startLoc };
  if (cell) result.cell = cell;
  if (transition) result.transition = transition;
  return result;
}
function parseWait(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "wait");
  if (ctx.check("IDENTIFIER") && ctx.peek().value.toLowerCase() === "movement") {
    ctx.advance();
    if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && (ctx.check("IDENTIFIER") || ctx.check("KEYWORD"))) {
      const target = ctx.advance().value;
      return { type: "wait", waitFor: "movement", waitTarget: target, loc: startLoc };
    }
    return { type: "wait", waitFor: "movement", loc: startLoc };
  }
  if (ctx.check("NUMBER")) {
    const value = ctx.peek().value;
    if (value.endsWith("ms") || value.endsWith("s")) {
      ctx.advance();
      const duration = value.endsWith("ms") ? parseFloat(value.slice(0, -2)) : parseFloat(value.slice(0, -1)) * 1e3;
      return { type: "wait", duration, loc: startLoc };
    }
  }
  const expr = parseExpression(ctx);
  return { type: "wait", durationExpr: expr, loc: startLoc };
}
function parseShout(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "shout");
  let target;
  if (ctx.check("KEYWORD") && ctx.peek().value === "to") {
    ctx.advance();
    if (ctx.check("TAG")) {
      const tagToken = ctx.advance();
      target = `#${tagToken.value}`;
    } else {
      target = parseIdentifierOrString(ctx);
    }
  }
  const message = parseIdentifierOrString(ctx);
  let params;
  if (ctx.check("LBRACE")) {
    ctx.advance();
    params = {};
    while (!ctx.check("RBRACE") && !ctx.check("NEWLINE") && !ctx.isAtEnd()) {
      const keyToken = ctx.peek();
      if (keyToken.type !== "IDENTIFIER" && keyToken.type !== "KEYWORD") {
        break;
      }
      ctx.advance();
      const key = keyToken.value;
      if (ctx.check("COLON")) {
        ctx.advance();
      }
      const value = parseExpression(ctx);
      params[key] = value;
      if (ctx.check("COMMA")) {
        ctx.advance();
      }
    }
    if (ctx.check("RBRACE")) {
      ctx.advance();
    }
  }
  const result = { type: "shout", message, loc: startLoc };
  if (target) result.target = target;
  if (params && Object.keys(params).length > 0) result.params = params;
  return result;
}
function parsePost(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "post");
  const url = parseExpression(ctx);
  const data = {};
  if (ctx.check("LBRACE")) {
    ctx.advance();
    while (!ctx.check("RBRACE") && !ctx.check("NEWLINE") && !ctx.isAtEnd()) {
      const keyToken = ctx.peek();
      if (keyToken.type !== "IDENTIFIER" && keyToken.type !== "KEYWORD") {
        break;
      }
      ctx.advance();
      const key = keyToken.value;
      if (ctx.check("COLON")) {
        ctx.advance();
      }
      const value = parseExpression(ctx);
      data[key] = value;
      if (ctx.check("COMMA")) {
        ctx.advance();
      }
    }
    if (ctx.check("RBRACE")) {
      ctx.advance();
    }
  }
  return { type: "post", url, data, loc: startLoc };
}
function parseFetch(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "fetch");
  const url = parseExpression(ctx);
  if (!ctx.check("KEYWORD") || ctx.peek().value !== "into") {
    ctx.error('Expected "into" after URL in fetch statement');
    return { type: "fetch", url, into: "", loc: startLoc };
  }
  ctx.advance();
  const into = parseIdentifierOrString(ctx);
  return { type: "fetch", url, into, loc: startLoc };
}
function parseLog(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "log");
  const expressions = [];
  while (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("INDENT") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    expressions.push(parseExpression(ctx));
    if (ctx.check("COMMA")) {
      ctx.advance();
    }
  }
  return { type: "log", expressions, loc: startLoc };
}
function parseDurationValue(value) {
  if (value.endsWith("ms")) {
    return parseFloat(value.slice(0, -2));
  } else if (value.endsWith("s")) {
    return parseFloat(value.slice(0, -1)) * 1e3;
  } else {
    return parseFloat(value);
  }
}
function parseAnimate(ctx) {
  const startLoc = ctx.loc();
  const animToken = ctx.advance();
  const animation = animToken.value;
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  let duration = 300;
  let durationExpr;
  let loop = false;
  if (ctx.check("KEYWORD") && ctx.peek().value === "loop") {
    ctx.advance();
    loop = true;
  } else if (ctx.check("NUMBER")) {
    const durationToken = ctx.advance();
    duration = parseDurationValue(durationToken.value);
    if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE") && ctx.check("KEYWORD") && ctx.peek().value === "loop") {
      ctx.advance();
      loop = true;
    }
  } else if (ctx.check("IDENTIFIER") || ctx.check("LPAREN") || ctx.check("KEYWORD") && ctx.peekNext()?.type === "DOT") {
    durationExpr = parseExpression(ctx);
    if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE") && ctx.check("KEYWORD") && ctx.peek().value === "loop") {
      ctx.advance();
      loop = true;
    }
  }
  const params = {};
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    const nextToken = ctx.peek();
    if (nextToken.type === "KEYWORD") {
      const val = nextToken.value;
      if (val === "horizontal" || val === "vertical") {
        ctx.advance();
        params.direction = val;
      } else if (val === "cw" || val === "ccw") {
        ctx.advance();
        params.direction = val;
      }
    } else if (nextToken.type === "NUMBER") {
      ctx.advance();
      const numValue = parseFloat(nextToken.value);
      switch (animation) {
        case "shake":
        case "vibrate":
          params.intensity = numValue;
          break;
        case "pulse":
          params.scale = numValue;
          break;
        case "bounce":
          params.height = numValue;
          break;
      }
    } else if (nextToken.type === "STRING" && animation === "glow") {
      ctx.advance();
      params.color = nextToken.value;
    }
  }
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE") && ctx.check("KEYWORD") && ctx.peek().value === "children") {
    ctx.advance();
    params.children = true;
  }
  const result = { type: "animate", animation, target, duration, loop, params, loc: startLoc };
  if (durationExpr) result.durationExpr = durationExpr;
  return result;
}
function parseStopAnimation(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "stop");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  let animation;
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    const nextToken = ctx.peek();
    if (nextToken.type === "KEYWORD" && ANIMATION_KEYWORDS.includes(nextToken.value)) {
      ctx.advance();
      animation = nextToken.value;
    }
  }
  return { type: "stop-animation", target, animation, loc: startLoc };
}
function parseActionCall(ctx) {
  ctx.advance();
  const firstToken = ctx.peek();
  if (firstToken.type !== "IDENTIFIER" && firstToken.type !== "KEYWORD") {
    ctx.error(`Expected action name after 'do', got ${firstToken.type}`);
    return { type: "action-call", object: "self", action: "" };
  }
  ctx.advance();
  if (ctx.peek().type === "DOT") {
    ctx.advance();
    const actionToken = ctx.peek();
    if (actionToken.type !== "IDENTIFIER" && actionToken.type !== "KEYWORD") {
      ctx.error(`Expected action name after '.', got ${actionToken.type}`);
      return { type: "action-call", object: firstToken.value, action: "" };
    }
    ctx.advance();
    return { type: "action-call", object: firstToken.value, action: actionToken.value };
  }
  return { type: "action-call", object: "self", action: firstToken.value };
}
function parseClearGrid(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "clear");
  const gridName = parseIdentifierOrString(ctx);
  if (ctx.check("DOT")) {
    const nextToken = ctx.peekNext();
    if (nextToken && nextToken.value === "cell") {
      const tokenAfterCell = ctx.tokens[ctx.pos + 2];
      if (tokenAfterCell && tokenAfterCell.type === "LBRACKET") {
        ctx.advance();
        ctx.advance();
        ctx.expect("LBRACKET");
        const xExpr = parseExpression(ctx);
        ctx.expect("RBRACKET");
        ctx.expect("LBRACKET");
        const yExpr = parseExpression(ctx);
        ctx.expect("RBRACKET");
        return { type: "clear-grid", gridName, x: xExpr, y: yExpr, loc: startLoc };
      }
    }
  }
  return { type: "clear-grid", gridName, loc: startLoc };
}
function parseSpawn(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "spawn");
  const templateName = parseIdentifierOrString(ctx);
  let anchorName;
  if (ctx.check("KEYWORD") && ctx.peek().value === "at") {
    ctx.advance();
    anchorName = parseIdentifierOrString(ctx);
  }
  let params;
  if (ctx.check("LBRACE")) {
    ctx.advance();
    params = {};
    while (!ctx.check("RBRACE") && !ctx.check("NEWLINE") && !ctx.isAtEnd()) {
      const keyToken = ctx.peek();
      if (keyToken.type !== "IDENTIFIER" && keyToken.type !== "KEYWORD") {
        break;
      }
      ctx.advance();
      const key = keyToken.value;
      if (ctx.check("COLON")) {
        ctx.advance();
      }
      const value = parseExpression(ctx);
      params[key] = value;
      if (ctx.check("COMMA")) {
        ctx.advance();
      }
    }
    if (ctx.check("RBRACE")) {
      ctx.advance();
    }
  }
  const result = { type: "spawn", templateName, loc: startLoc };
  if (anchorName) result.anchorName = anchorName;
  if (params && Object.keys(params).length > 0) result.params = params;
  return result;
}
function parseDestroy(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "destroy");
  const target = parseExpression(ctx);
  const transition = parseTransition(ctx, VISIBILITY_TRANSITIONS);
  const result = { type: "destroy", target, loc: startLoc };
  if (transition) result.transition = transition;
  return result;
}
function parseCopy(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "copy");
  const value = parseExpression(ctx);
  return { type: "copy", value, loc: startLoc };
}
function parseAnimateGroup(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "animate");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  const groupToken = ctx.advance();
  const group = groupToken.value;
  let fps;
  let duration;
  let durationExpr;
  let easing;
  let playMode = "loop";
  let rotationDirection;
  let resume = false;
  let exclusive = false;
  let reverse = false;
  while (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    const nextToken = ctx.peek();
    if (nextToken.type === "KEYWORD") {
      if (nextToken.value === "fps") {
        ctx.advance();
        const fpsToken = ctx.advance();
        fps = parseInt(fpsToken.value, 10);
      } else if (nextToken.value === "duration") {
        ctx.advance();
        const durPeek = ctx.peek();
        if (durPeek.type === "NUMBER") {
          const durToken = ctx.advance();
          duration = parseInt(durToken.value, 10);
        } else {
          durationExpr = parseExpression(ctx);
        }
        if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
          const maybeEasing = ctx.peek();
          if (maybeEasing.type === "IDENTIFIER" || maybeEasing.type === "KEYWORD" && !["loop", "once", "pingpong", "fps", "duration", "cw", "ccw", "resume", "exclusive", "reverse"].includes(maybeEasing.value)) {
            easing = ctx.advance().value;
          }
        }
      } else if (nextToken.value === "loop") {
        ctx.advance();
        playMode = "loop";
      } else if (nextToken.value === "once") {
        ctx.advance();
        playMode = "once";
      } else if (nextToken.value === "pingpong") {
        ctx.advance();
        playMode = "pingpong";
      } else if (nextToken.value === "cw" || nextToken.value === "ccw") {
        rotationDirection = ctx.advance().value;
      } else if (nextToken.value === "resume") {
        ctx.advance();
        resume = true;
      } else if (nextToken.value === "exclusive") {
        ctx.advance();
        exclusive = true;
      } else if (nextToken.value === "reverse") {
        ctx.advance();
        reverse = true;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  const result = { type: "animate-group", target, group, fps, duration, easing, playMode, rotationDirection, resume: resume || void 0, exclusive: exclusive || void 0, reverse: reverse || void 0, loc: startLoc };
  if (durationExpr) result.durationExpr = durationExpr;
  return result;
}
function parseStopAnimateGroup(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "stop");
  ctx.expect("KEYWORD", "animate");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  return { type: "stop-animate-group", target, loc: startLoc };
}
function parsePlay(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "play");
  const target = parseIdentifierOrString(ctx);
  let loop = false;
  if (ctx.check("KEYWORD") && ctx.peek().value === "loop") {
    ctx.advance();
    loop = true;
  }
  const result = { type: "play", target, loc: startLoc };
  if (loop) result.loop = true;
  return result;
}
function parsePause(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "pause");
  const target = parseIdentifierOrString(ctx);
  return { type: "pause", target, loc: startLoc };
}
function parseImpulse(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "impulse");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  const vx = parseUnary(ctx);
  const vy = parseUnary(ctx);
  return { type: "impulse", target, vx, vy, loc: startLoc };
}
function parseJump(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "jump");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  let height;
  if (ctx.check("IDENTIFIER") && ctx.peek().value.toLowerCase() === "height") {
    ctx.advance();
    height = parseExpression(ctx);
  }
  const result = { type: "jump", target, loc: startLoc };
  if (height) result.height = height;
  return result;
}
function parseScreenshake(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "screenshake");
  let duration = 300;
  let loop = false;
  let intensityFrom = 3;
  let intensityTo = 3;
  let hasRange = false;
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    if (ctx.check("KEYWORD") && ctx.peek().value === "loop") {
      ctx.advance();
      loop = true;
      duration = 1e3;
    } else if (ctx.check("NUMBER")) {
      duration = parseFloat(ctx.advance().value);
    }
  }
  while (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    if (ctx.check("KEYWORD") && ctx.peek().value === "loop") {
      ctx.advance();
      loop = true;
    } else if (ctx.check("NUMBER")) {
      const numVal = parseFloat(ctx.advance().value);
      if (ctx.check("OPERATOR") && ctx.peek().value === "-" && ctx.peekNext()?.type === "NUMBER") {
        ctx.advance();
        const toVal = parseFloat(ctx.advance().value);
        intensityFrom = numVal;
        intensityTo = toVal;
        hasRange = true;
      } else {
        intensityFrom = numVal;
        intensityTo = numVal;
      }
    } else {
      break;
    }
  }
  return {
    type: "screenshake",
    duration,
    loop,
    intensityFrom,
    intensityTo: hasRange ? intensityTo : intensityFrom,
    loc: startLoc
  };
}
function parseReveal(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "reveal");
  const target = parseIdentifierOrString(ctx);
  const x = parseExpression(ctx);
  const y = parseExpression(ctx);
  let radius;
  let fade;
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    radius = parseExpression(ctx);
    if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
      fade = parseExpression(ctx);
    }
  }
  return { type: "reveal", target, x, y, radius, fade, loc: startLoc };
}
function parseRehide(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "rehide");
  const target = parseIdentifierOrString(ctx);
  let revealer;
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    revealer = parseIdentifierOrString(ctx);
  }
  const result = { type: "rehide", target, loc: startLoc };
  if (revealer) result.revealer = revealer;
  return result;
}
function parseTransport(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "transport");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  ctx.expect("KEYWORD", "to");
  const x = parseExpression(ctx);
  const y = parseExpression(ctx);
  ctx.expect("KEYWORD", "over");
  const duration = parseExpression(ctx);
  let easing;
  if (!ctx.isAtEnd() && !ctx.check("NEWLINE") && !ctx.check("DEDENT") && !ctx.check("RBRACE")) {
    const maybeEasing = ctx.peek();
    if (maybeEasing.type === "IDENTIFIER" || maybeEasing.type === "KEYWORD") {
      easing = ctx.advance().value;
    }
  }
  const stmt = { type: "transport", target, x, y, duration, loc: startLoc };
  if (easing) stmt.easing = easing;
  return stmt;
}
function parseMoveTo(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "moveto");
  let target;
  if (ctx.check("TAG")) {
    const tagToken = ctx.advance();
    target = `tag:${tagToken.value}`;
  } else if (ctx.check("KEYWORD") && ctx.peek().value === "all") {
    ctx.advance();
    const typeToken = ctx.peek();
    if (typeToken.type === "IDENTIFIER" || typeToken.type === "KEYWORD") {
      ctx.advance();
      const resolvedType = TYPE_SELECTORS[typeToken.value.toLowerCase()];
      target = resolvedType ? `all:${resolvedType}` : typeToken.value;
    } else {
      target = "all";
    }
  } else {
    target = parseIdentifierOrString(ctx);
  }
  const next = ctx.peek();
  const isEndToken = (t) => !t || t.type === "NEWLINE" || t.type === "DEDENT" || t.type === "EOF" || t.type === "RBRACE";
  if ((next.type === "IDENTIFIER" || next.type === "KEYWORD") && next.value !== "self") {
    const afterNext = ctx.peekNext();
    if (isEndToken(afterNext) || afterNext?.type === "DOT" === false && isEndToken(afterNext)) {
      if (afterNext?.type !== "DOT") {
        const destination = parseIdentifierOrString(ctx);
        const dummy = { type: "literal", value: 0 };
        return { type: "moveTo", target, x: dummy, y: dummy, destination, loc: startLoc };
      }
    }
  }
  const x = parseExpression(ctx);
  const y = parseExpression(ctx);
  return { type: "moveTo", target, x, y, loc: startLoc };
}
function parsePress(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "press");
  const key = parseIdentifierOrString(ctx);
  let target;
  if ((ctx.check("KEYWORD") || ctx.check("IDENTIFIER")) && ctx.peek().value === "on") {
    ctx.advance();
    target = parseIdentifierOrString(ctx);
  }
  const result = { type: "press", key, loc: startLoc };
  if (target) result.target = target;
  return result;
}
function parseRelease(ctx) {
  const startLoc = ctx.loc();
  ctx.expect("KEYWORD", "release");
  const key = parseIdentifierOrString(ctx);
  let target;
  if ((ctx.check("KEYWORD") || ctx.check("IDENTIFIER")) && ctx.peek().value === "on") {
    ctx.advance();
    target = parseIdentifierOrString(ctx);
  }
  const result = { type: "release", key, loc: startLoc };
  if (target) result.target = target;
  return result;
}

// src/utils/scriptParser.ts
var Parser = class {
  // Made public to satisfy parser context interfaces
  tokens;
  pos = 0;
  errors = [];
  constructor(tokens) {
    this.tokens = tokens;
  }
  // Get current source location (1-based line number)
  loc() {
    return { line: this.peek().line + 1 };
  }
  parse() {
    const statements = [];
    while (!this.isAtEnd()) {
      this.skipNewlines();
      while (this.check("OPERATOR") && this.peek().value === "/") {
        this.advance();
        this.skipNewlines();
      }
      if (this.isAtEnd()) break;
      try {
        const stmt = this.parseStatement();
        if (stmt) statements.push(stmt);
      } catch (e) {
        this.synchronize();
      }
    }
    return { statements, errors: this.errors };
  }
  // Public to satisfy ControlFlowParserContext interface (for parseBlock)
  parseStatement() {
    const token = this.peek();
    switch (token.value) {
      case "do":
        return this.parseActionCall();
      case "if":
        return this.parseIf();
      case "goto":
        return this.parseGoto();
      case "transition":
        return this.parseCellTransition();
      case "show":
        return this.parseShow();
      case "hide":
        return this.parseHide();
      case "wait":
        return this.parseWait();
      case "sync":
        return this.parseSync();
      case "set":
        return this.parseSet();
      case "enable":
        return this.parseEnable();
      case "disable":
        return this.parseDisable();
      case "reset":
        return this.parseReset();
      case "restart":
        return this.parseRestart();
      case "endgame":
        return this.parseEndGame();
      case "next":
        return this.parseNext();
      case "prev":
        return this.parsePrev();
      case "wrap":
        return this.parseWrap();
      case "shout":
        return this.parseShout();
      case "post":
        return this.parsePost();
      case "fetch":
        return this.parseFetch();
      case "first":
        return this.parseFirst();
      case "foreach":
        return this.parseForeach();
      case "repeat":
        return this.parseRepeat();
      case "log":
        return this.parseLog();
      case "shake":
      case "vibrate":
      case "pulse":
      case "squeeze":
      case "bounce":
      case "spin":
      case "glow":
        return this.parseAnimate();
      case "screenshake":
        return this.parseScreenshake();
      case "animate":
        return this.parseAnimateGroup();
      case "stop":
        if (this.pos + 1 < this.tokens.length && this.tokens[this.pos + 1].value === "animate") {
          return this.parseStopAnimateGroup();
        }
        if (this.pos + 1 < this.tokens.length && this.tokens[this.pos + 1].value === "screenshake") {
          this.pos += 2;
          return { type: "stop-screenshake", loc: { line: this.tokens[this.pos - 2].line } };
        }
        return this.parseStopAnimation();
      case "clear":
        return this.parseClearGrid();
      case "spawn":
        return this.parseSpawn();
      case "destroy":
        return this.parseDestroy();
      case "copy":
        return this.parseCopy();
      case "play":
        return this.parsePlay();
      case "pause":
        return this.parsePause();
      case "jump":
        return this.parseJump();
      case "impulse":
        return this.parseImpulse();
      case "reveal":
        return this.parseReveal();
      case "rehide":
        return this.parseRehide();
      case "transport":
        return this.parseTransport();
      case "moveto":
        return this.parseMoveTo();
      case "save":
        return this.parseSave();
      case "load":
        return this.parseLoad();
      case "delete":
        if (this.pos + 1 < this.tokens.length && this.tokens[this.pos + 1].value === "save") {
          return this.parseDeleteSave();
        }
        this.error('Expected "save" after "delete"');
        this.advance();
        return null;
      case "press":
        return this.parsePress();
      case "release":
        return this.parseRelease();
      case "return":
        return this.parseReturn();
      case "break":
        return this.parseBreak();
      default:
        this.error(`Unexpected token: ${token.value}`);
        this.advance();
        return null;
    }
  }
  // Control flow parsing - delegated to extracted module
  parseIf() {
    return parseIf(this);
  }
  parseFirst() {
    return parseFirst(this);
  }
  parseForeach() {
    return parseForeach(this);
  }
  parseRepeat() {
    return parseRepeat(this);
  }
  // Navigation parsing - delegated to extracted module
  parseGoto() {
    return parseGoto(this);
  }
  parseNext() {
    return parseNext(this);
  }
  parsePrev() {
    return parsePrev(this);
  }
  parseWrap() {
    return parseWrap(this);
  }
  parseCellTransition() {
    return parseCellTransition(this);
  }
  // Set statement parsing - delegated to extracted module
  parseSet() {
    return parseSet(this);
  }
  // Enable/disable parsing - delegated to extracted module
  parseEnable() {
    return parseEnable(this);
  }
  parseDisable() {
    return parseDisable(this);
  }
  parseReset() {
    return parseReset(this);
  }
  parseRestart() {
    return parseRestart(this);
  }
  parseEndGame() {
    return parseEndGame(this);
  }
  parseReturn() {
    return parseReturn(this);
  }
  parseBreak() {
    return parseBreak(this);
  }
  parseSave() {
    return parseSave(this);
  }
  parseLoad() {
    return parseLoad(this);
  }
  parseDeleteSave() {
    return parseDeleteSave(this);
  }
  // Actions parsing - delegated to extracted module
  parseShow() {
    return parseShow(this);
  }
  parseHide() {
    return parseHide(this);
  }
  parseWait() {
    return parseWait(this);
  }
  parseSync() {
    const startLoc = this.loc();
    this.expect("KEYWORD", "sync");
    return { type: "sync", loc: startLoc };
  }
  parseShout() {
    return parseShout(this);
  }
  parsePost() {
    return parsePost(this);
  }
  parseFetch() {
    return parseFetch(this);
  }
  parseLog() {
    return parseLog(this);
  }
  parseAnimate() {
    return parseAnimate(this);
  }
  parseScreenshake() {
    return parseScreenshake(this);
  }
  parseStopAnimation() {
    return parseStopAnimation(this);
  }
  parseAnimateGroup() {
    return parseAnimateGroup(this);
  }
  parseStopAnimateGroup() {
    return parseStopAnimateGroup(this);
  }
  parseClearGrid() {
    return parseClearGrid(this);
  }
  parseSpawn() {
    return parseSpawn(this);
  }
  parseDestroy() {
    return parseDestroy(this);
  }
  parseCopy() {
    return parseCopy(this);
  }
  parsePlay() {
    return parsePlay(this);
  }
  parsePause() {
    return parsePause(this);
  }
  parseJump() {
    return parseJump(this);
  }
  parseImpulse() {
    return parseImpulse(this);
  }
  parseReveal() {
    return parseReveal(this);
  }
  parseRehide() {
    return parseRehide(this);
  }
  parseTransport() {
    return parseTransport(this);
  }
  parseMoveTo() {
    return parseMoveTo(this);
  }
  parsePress() {
    return parsePress(this);
  }
  parseRelease() {
    return parseRelease(this);
  }
  parseActionCall() {
    return parseActionCall(this);
  }
  // Helper methods (public to satisfy parser context interfaces)
  peek() {
    return this.tokens[this.pos] || { type: "EOF", value: "", line: 0, column: 0 };
  }
  peekNext() {
    return this.tokens[this.pos + 1] || null;
  }
  advance() {
    const token = this.peek();
    if (!this.isAtEnd()) this.pos++;
    return token;
  }
  check(type, value) {
    const token = this.peek();
    if (token.type !== type) return false;
    if (value !== void 0 && token.value !== value) return false;
    return true;
  }
  expect(type, value) {
    if (!this.check(type, value)) {
      this.error(`Expected ${type}${value ? ` '${value}'` : ""}, got ${this.peek().type} '${this.peek().value}'`);
    }
    return this.advance();
  }
  skipOptional(type) {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }
  skipNewlines() {
    while (this.check("NEWLINE")) {
      this.advance();
    }
  }
  isAtEnd() {
    return this.peek().type === "EOF";
  }
  error(message) {
    const token = this.peek();
    this.errors.push({ message, line: token.line, column: token.column });
  }
  synchronize() {
    while (!this.isAtEnd()) {
      if (this.check("NEWLINE")) {
        this.advance();
        return;
      }
      this.advance();
    }
  }
};
function parseScript(source) {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  return parser.parse();
}
function formatParseErrors(errors) {
  return errors.map((e) => `Line ${e.line + 1}, Col ${e.column + 1}: ${e.message}`).join("\n");
}
function parseKeyEventLine(afterEvent) {
  let key = void 0;
  let rest = afterEvent;
  if (rest.startsWith('"') || rest.startsWith("'")) {
    const quote = rest[0];
    const endQuote = rest.indexOf(quote, 1);
    if (endQuote !== -1) {
      key = rest.slice(1, endQuote);
      rest = rest.slice(endQuote + 1).trim();
    }
  }
  if (rest.startsWith(":")) {
    rest = rest.slice(1).trim();
  }
  return { key, inlineAction: rest };
}
function parseSingleEvent(token) {
  const tokenLower = token.toLowerCase().trim();
  if (tokenLower === "onclick") {
    return { event: "onClick" };
  } else if (tokenLower === "onenter") {
    return { event: "onEnter" };
  } else if (tokenLower === "onexit") {
    return { event: "onExit" };
  } else if (tokenLower.startsWith("onkeydown")) {
    const afterEvent = token.slice(9).trim();
    const keyResult = parseKeyEventLine(afterEvent + ":");
    return { event: "onKeyDown", key: keyResult.key };
  } else if (tokenLower.startsWith("onkeyup")) {
    const afterEvent = token.slice(7).trim();
    const keyResult = parseKeyEventLine(afterEvent + ":");
    return { event: "onKeyUp", key: keyResult.key };
  } else if (tokenLower.startsWith("onmessagefrom")) {
    const afterEvent = token.slice(13).trim();
    let from;
    let rest;
    if (afterEvent.startsWith("#")) {
      const tagMatch = afterEvent.match(/^#([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (tagMatch) {
        from = `#${tagMatch[1]}`;
        rest = afterEvent.slice(tagMatch[0].length).trim();
      } else {
        return null;
      }
    } else {
      const quotedMatch = afterEvent.match(/^["']([^"']+)["']/);
      if (quotedMatch) {
        from = quotedMatch[1];
        rest = afterEvent.slice(quotedMatch[0].length).trim();
      } else {
        const identMatch = afterEvent.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)/);
        if (identMatch) {
          from = identMatch[1];
          rest = afterEvent.slice(identMatch[0].length).trim();
        } else {
          return null;
        }
      }
    }
    const messageMatch = rest.match(/^["']([^"']+)["']/);
    const message = messageMatch ? messageMatch[1] : rest;
    return { event: "onMessage", message, from };
  } else if (tokenLower.startsWith("onmessage")) {
    const afterEvent = token.slice(9).trim();
    const messageMatch = afterEvent.match(/^["']([^"']+)["']/);
    const message = messageMatch ? messageMatch[1] : afterEvent;
    return { event: "onMessage", message };
  } else if (tokenLower === "onoverlapend") {
    return { event: "onOverlapEnd" };
  } else if (tokenLower === "onoverlap") {
    return { event: "onOverlap" };
  } else if (tokenLower === "oncollide") {
    return { event: "onCollide" };
  } else if (tokenLower === "onhoverend") {
    return { event: "onHoverEnd" };
  } else if (tokenLower === "onhover") {
    return { event: "onHover" };
  } else if (tokenLower.startsWith("onmove")) {
    const afterEvent = token.slice(6).trim();
    if (afterEvent) {
      const dirMatch = afterEvent.match(/^["']([^"']+)["']/);
      const direction = dirMatch ? dirMatch[1] : afterEvent;
      return { event: "onMove", direction };
    }
    return { event: "onMove" };
  } else if (tokenLower.startsWith("onrotate")) {
    const afterEvent = token.slice(8).trim();
    if (afterEvent) {
      const dirMatch = afterEvent.match(/^["']([^"']+)["']/);
      const direction = dirMatch ? dirMatch[1] : afterEvent;
      return { event: "onRotate", direction };
    }
    return { event: "onRotate" };
  } else if (tokenLower === "onstop") {
    return { event: "onStop" };
  } else if (tokenLower === "onstoprotate") {
    return { event: "onStopRotate" };
  } else if (tokenLower === "ontick") {
    return { event: "onTick" };
  } else if (tokenLower === "onjump") {
    return { event: "onJump" };
  } else if (tokenLower === "onlanding") {
    return { event: "onLanding" };
  } else if (tokenLower === "onspawn") {
    return { event: "onSpawn" };
  } else if (tokenLower === "ondestroy") {
    return { event: "onDestroy" };
  } else if (tokenLower === "ondragstart") {
    return { event: "onDragStart" };
  } else if (tokenLower === "ondrag") {
    return { event: "onDrag" };
  } else if (tokenLower === "ondragend") {
    return { event: "onDragEnd" };
  }
  return null;
}
function parseEventLine(line) {
  const trimmed = line.trim();
  let colonIdx = -1;
  let braceIdx = -1;
  let inQuote = false;
  let quoteChar = "";
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (!inQuote && (char === '"' || char === "'")) {
      inQuote = true;
      quoteChar = char;
    } else if (inQuote && char === quoteChar) {
      inQuote = false;
    } else if (!inQuote && char === ":") {
      colonIdx = i;
    } else if (!inQuote && char === "{" && braceIdx === -1) {
      braceIdx = i;
    }
  }
  let delimiterIdx = -1;
  let blockStyle = "none";
  if (braceIdx !== -1 && (colonIdx === -1 || braceIdx < colonIdx)) {
    delimiterIdx = braceIdx;
    blockStyle = "brace";
  } else if (colonIdx !== -1) {
    delimiterIdx = colonIdx;
    blockStyle = "colon";
  }
  if (delimiterIdx === -1) {
    const eventPart2 = trimmed;
    const eventTokens2 = eventPart2.split("|").map((t) => t.trim()).filter((t) => t);
    const parsedEvents2 = [];
    for (const token of eventTokens2) {
      const parsed = parseSingleEvent(token);
      if (parsed) {
        parsedEvents2.push(parsed);
      } else {
        return null;
      }
    }
    if (parsedEvents2.length > 0) {
      return { events: parsedEvents2, inlineAction: "", blockStyle: "none" };
    }
    return null;
  }
  const eventPart = trimmed.slice(0, delimiterIdx);
  let inlineAction = trimmed.slice(delimiterIdx + 1).trim();
  if (blockStyle === "brace" && inlineAction.endsWith("}")) {
    inlineAction = inlineAction.slice(0, -1).trim();
  }
  const eventTokens = eventPart.split("|").map((t) => t.trim()).filter((t) => t);
  const parsedEvents = [];
  for (const token of eventTokens) {
    const parsed = parseSingleEvent(token);
    if (parsed) {
      parsedEvents.push(parsed);
    }
  }
  if (parsedEvents.length === 0) {
    return null;
  }
  return { events: parsedEvents, inlineAction, blockStyle };
}
function parseActionLine(line) {
  const trimmed = line.trim();
  if (!trimmed.toLowerCase().startsWith("action ")) {
    return null;
  }
  const colonIdx = trimmed.indexOf(":");
  const braceIdx = trimmed.indexOf("{");
  let delimiterIdx = -1;
  let blockStyle = "colon";
  if (braceIdx !== -1 && (colonIdx === -1 || braceIdx < colonIdx)) {
    delimiterIdx = braceIdx;
    blockStyle = "brace";
  } else if (colonIdx !== -1) {
    delimiterIdx = colonIdx;
    blockStyle = "colon";
  }
  if (delimiterIdx === -1) {
    return null;
  }
  const name = trimmed.slice(7, delimiterIdx).trim();
  if (!name) {
    return null;
  }
  let inlineStatements = trimmed.slice(delimiterIdx + 1).trim();
  if (blockStyle === "brace" && inlineStatements.endsWith("}")) {
    inlineStatements = inlineStatements.slice(0, -1).trim();
  }
  return { name, inlineStatements, blockStyle };
}
function parseEventScript(source) {
  const lines = source.split("\n");
  const events = [];
  const actions = [];
  const errors = [];
  let currentBlock = null;
  let currentStartLine = 0;
  let braceDepth = 0;
  const normalizeBlock = (startLine, endLine) => {
    const blockLines = lines.slice(startLine, endLine);
    let minIndent = Infinity;
    for (const line of blockLines) {
      if (line.trim() === "" || line.trim().startsWith("//") || line.trim().startsWith("#")) continue;
      const indent = line.length - line.trimStart().length;
      if (indent > 0 && indent < minIndent) minIndent = indent;
    }
    if (minIndent === Infinity) minIndent = 0;
    const normalizedLines = blockLines.map((line) => {
      if (line.trim() === "" || line.trim().startsWith("//") || line.trim().startsWith("#")) return line.trim();
      const indent = line.length - line.trimStart().length;
      if (indent >= minIndent) return line.slice(minIndent);
      return line.trimStart();
    });
    return normalizedLines.join("\n");
  };
  const closeCurrentBlock = (endLine) => {
    if (currentBlock === null) return;
    const blockSource = normalizeBlock(currentStartLine, endLine);
    const result = parseScript(blockSource);
    if (currentBlock.type === "events") {
      for (const evt of currentBlock.events) {
        events.push({ event: evt.event, key: evt.key, message: evt.message, from: evt.from, direction: evt.direction, statements: result.statements });
      }
    } else if (currentBlock.type === "action") {
      actions.push({ name: currentBlock.name, statements: result.statements });
    }
    errors.push(...result.errors.map((e) => ({ ...e, line: e.line + currentStartLine })));
    currentBlock = null;
  };
  const countBraceChange = (line) => {
    let change = 0;
    let inQuote = false;
    let quoteChar = "";
    for (const char of line) {
      if (!inQuote && (char === '"' || char === "'")) {
        inQuote = true;
        quoteChar = char;
      } else if (inQuote && char === quoteChar) {
        inQuote = false;
      } else if (!inQuote) {
        if (char === "{") change++;
        else if (char === "}") change--;
      }
    }
    return change;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (currentBlock && currentBlock.blockStyle === "brace") {
      braceDepth += countBraceChange(line);
      if (braceDepth <= 0) {
        closeCurrentBlock(i);
        braceDepth = 0;
        continue;
      }
      continue;
    }
    if (!line.trim()) {
      continue;
    }
    const actionParsed = parseActionLine(line);
    if (actionParsed) {
      closeCurrentBlock(i);
      const isSingleLine = actionParsed.blockStyle === "brace" ? line.trim().endsWith("}") : !!actionParsed.inlineStatements;
      if (isSingleLine && actionParsed.inlineStatements) {
        const result = parseScript(actionParsed.inlineStatements);
        actions.push({ name: actionParsed.name, statements: result.statements });
        errors.push(...result.errors);
        currentBlock = null;
      } else {
        currentBlock = { type: "action", name: actionParsed.name, blockStyle: actionParsed.blockStyle };
        currentStartLine = i + 1;
        if (actionParsed.blockStyle === "brace") {
          braceDepth = 1;
        }
      }
      continue;
    }
    const eventParsed = parseEventLine(line);
    if (eventParsed && eventParsed.events.length > 0) {
      closeCurrentBlock(i);
      const isSingleLine = eventParsed.blockStyle === "brace" ? line.trim().endsWith("}") : !!eventParsed.inlineAction;
      if (isSingleLine && eventParsed.inlineAction) {
        const result = parseScript(eventParsed.inlineAction);
        for (const evt of eventParsed.events) {
          events.push({ event: evt.event, key: evt.key, message: evt.message, from: evt.from, direction: evt.direction, statements: result.statements });
        }
        errors.push(...result.errors);
        currentBlock = null;
      } else {
        const effectiveBlockStyle = eventParsed.blockStyle === "none" ? "colon" : eventParsed.blockStyle;
        currentBlock = { type: "events", events: eventParsed.events, blockStyle: effectiveBlockStyle };
        currentStartLine = i + 1;
        if (effectiveBlockStyle === "brace") {
          braceDepth = 1;
        }
      }
    }
  }
  closeCurrentBlock(lines.length);
  if (events.length === 0 && actions.length === 0) {
    const result = parseScript(source);
    if (result.statements.length > 0) {
      events.push({ event: "onEnter", statements: result.statements });
    }
    errors.push(...result.errors);
  }
  return { events, actions, errors };
}

// src/types/scriptRegistry.ts
var EVENTS = {
  onEnter: {
    description: "When entering cell",
    longDescription: "Triggers when the player navigates to this cell. Runs for the cell first, then objects in z-order. Useful for initializing state, showing welcome messages, or checking conditions.",
    validFor: ["cell", "object"],
    example: `onEnter:
  show WelcomeMessage
  wait 2000
  hide WelcomeMessage`,
    notes: "Fires for cell, then objects in z-order. Use for setup logic when player arrives."
  },
  onExit: {
    description: "When leaving cell",
    longDescription: "Triggers when the player navigates away from this cell. Runs for the cell first, then objects in z-order. Useful for cleanup, saving state, or farewell messages.",
    validFor: ["cell", "object"],
    example: `onExit:
  hide AllPanels
  set lastVisited currentCell`,
    notes: "Fires for cell, then objects in z-order. Good for cleanup before leaving."
  },
  onClick: {
    description: "When clicked",
    longDescription: "Triggers when the element is clicked. For cells, triggers when clicking the canvas background. Multiple onClick blocks run sequentially (first click runs first block, second click runs second, etc.).",
    validFor: ["cell", "object"],
    example: `onClick:
  show Panel1
onClick:
  hide Panel1
  show Panel2`,
    notes: "Sequential blocks cycle through on repeated clicks. Use reset script to loop back."
  },
  onKeyDown: {
    description: "When key pressed",
    longDescription: "Triggers when a keyboard key is pressed while in this cell. Can optionally filter by specific key. Also fires for gamepad button presses \u2014 each button triggers both a gamepad-specific name and a keyboard equivalent.",
    validFor: ["cell"],
    example: `onKeyDown "space":
  show HelpPanel

onKeyDown:
  hide HelpPanel`,
    parameters: [
      { name: "key", type: "string", description: "Key to listen for (optional)", optional: true }
    ],
    notes: 'Key names: "space", "enter", "escape", "a"-"z", "0"-"9", "arrowup", "arrowdown", etc. Gamepad buttons: "gamepad-a" (= Space), "gamepad-b" (= Escape), "gamepad-x" (= e), "gamepad-y" (= q), "gamepad-up/down/left/right" (= arrows).'
  },
  onKeyUp: {
    description: "When key released",
    longDescription: "Triggers when a keyboard key is released. Can optionally filter by specific key. Often paired with onKeyDown for toggle behaviors. Also fires for gamepad button releases.",
    validFor: ["cell"],
    example: `onKeyUp "escape":
  goto "MainMenu"`,
    parameters: [
      { name: "key", type: "string", description: "Key to listen for (optional)", optional: true }
    ],
    notes: "Same key names as onKeyDown, including gamepad names."
  },
  onMessage: {
    description: "When message received",
    longDescription: 'Triggers when a matching message is broadcast via shout. Messages are project-wide - any object in any cell can hear them. Objects CAN hear their own shouts (self-hearing is allowed), but infinite loops are blocked (shouting the same message from within its handler). Use `onMessageFrom` to filter by source. Parameters passed via `shout "MSG" {key: value}` are available as local variables in the handler (e.g., `shout "DAMAGE" {amount: 10}` makes `amount` available as a variable).',
    validFor: ["cell", "object"],
    example: `onMessage "DAMAGE":
  set health health - amount
  if health <= 0:
    destroy self`,
    parameters: [
      { name: "message", type: "string", description: "Message to listen for" }
    ],
    notes: "Project-wide broadcast. Self-hearing allowed, but same-message infinite loops blocked. Shout parameters become local variables in the handler."
  },
  onMessageFrom: {
    description: "When message from specific source",
    longDescription: "Like onMessage, but only triggers when the message comes from a specific object. Useful for filtering messages when multiple objects shout the same message type.",
    validFor: ["cell", "object"],
    example: `onMessageFrom Player "MOVED":
  set lastPlayerPos Player.x

onMessageFrom Controller "GAME_OVER":
  show GameOverScreen`,
    parameters: [
      { name: "source", type: "string", description: "Object name that must be the shouter" },
      { name: "message", type: "string", description: "Message to listen for" }
    ],
    notes: "Only fires if the specified object shouted the message."
  },
  onOverlap: {
    description: "When overlap starts",
    longDescription: "Triggers when this object begins overlapping another object. At least one object in the pair must have sensor enabled. The other object is accessible via the `other` variable \u2014 read properties with other.property, check tags with `if other hasTag #tag`, and read custom variables (e.g., other.score).",
    validFor: ["object"],
    example: `onOverlap:
  if other hasTag #coin:
    hide other
    set score score + 1`,
    notes: "Requires sensor property. Fires once on overlap start. `other` references the overlapping object \u2014 access its properties and custom variables."
  },
  onOverlapEnd: {
    description: "When overlap ends",
    longDescription: "Triggers when this object stops overlapping another object that it was previously overlapping. The other object is accessible via the `other` variable \u2014 same access as onOverlap (other.property, other hasTag, other.customVar).",
    validFor: ["object"],
    example: `onOverlapEnd:
  set inZone false`,
    notes: "Fires when objects that were overlapping separate. `other` references the departing object."
  },
  onCollide: {
    description: "When collision occurs",
    longDescription: "Triggers when this object collides with a blocking object. Unlike onOverlap (which requires sensor), onCollide fires when physics collision resolution happens. The other object is accessible via the `other` variable \u2014 read its properties with other.property (other.name, other.x, other.visible) or check tags with `if other hasTag #tag`. You can also read custom object variables from the other object (e.g., other.damage).",
    validFor: ["object"],
    example: `onCollide:
  if other hasTag #missile:
    set self.health self.health - other.damage
    destroy other`,
    notes: "Fires on physical collision with blocking objects. `other` references the colliding object \u2014 access its properties and custom variables. Works on both movers and blockers."
  },
  onBreak: {
    description: "When peg constraint breaks",
    longDescription: "Triggers when a peg constraint breaks because the force exceeded its breakForce threshold. Only fires on peg objects with breakForce set.",
    validFor: ["object"],
    example: `onBreak:
  spawn "Sparks" {x: self.x, y: self.y}
  destroy self`,
    notes: "Only fires on peg objects when breakForce is exceeded."
  },
  onHover: {
    description: "When mouse enters",
    longDescription: "Triggers when the mouse cursor enters this object's bounds. Useful for hover effects, tooltips, or highlighting interactive elements.",
    validFor: ["object"],
    example: `onHover:
  set opacity 0.8
  show Tooltip`,
    notes: "Fires once when mouse enters. Pair with onHoverEnd for leave effects."
  },
  onHoverEnd: {
    description: "When mouse leaves",
    longDescription: "Triggers when the mouse cursor leaves this object's bounds after previously hovering over it. Use to reset hover effects.",
    validFor: ["object"],
    example: `onHoverEnd:
  set opacity 1
  hide Tooltip`,
    notes: "Fires once when mouse leaves. Only fires if onHover previously fired."
  },
  onDragStart: {
    description: "When drag begins",
    longDescription: "Triggers when the user starts dragging this object. Fires after the pointer has moved beyond the drag threshold (5 pixels). Works on any object with this script \u2014 if draggable is also enabled, the object moves with the pointer; otherwise only events fire (useful for slingshot, joystick, swipe gestures).",
    validFor: ["object"],
    example: `onDragStart:
  set opacity 0.7
  set self.z 1000`,
    notes: "Fires once when drag motion exceeds threshold. Add draggable for auto-move."
  },
  onDrag: {
    description: "While being dragged",
    longDescription: "Triggers continuously while this object is being dragged. Fires on each pointer move during drag. Use clickX/clickY to read the pointer position. If draggable is enabled, the object follows the pointer; otherwise the object stays put and only events fire.",
    validFor: ["object"],
    example: `onDrag:
  if self.x < 0:
    set self.x 0`,
    notes: "Fires repeatedly during drag motion. clickX/clickY available."
  },
  onDragEnd: {
    description: "When drag ends",
    longDescription: "Triggers when the user releases this object after dragging. Useful for snapping to position, validating drop location, launching with impulse, or resetting visual state.",
    validFor: ["object"],
    example: `onDragEnd:
  set opacity 1
  if self.x > 0.5:
    set self.x 0.5`,
    notes: "Fires once when pointer is released after dragging."
  },
  onMove: {
    description: "When movement direction changes",
    longDescription: `Triggers when this object starts moving in a new direction. Fires each time the direction changes (up, down, left, right). For forward-axis objects, also fires with "forward" or "backward" relative to the object's facing direction.`,
    validFor: ["object"],
    example: `onMove "down":
  set self.state "walkDown"
onMove "forward":
  animate self "walk" loop resume`,
    notes: 'Fires when direction changes. Use direction parameter to filter: "up", "down", "left", "right", "forward", "backward". Without parameter, fires for any direction change. Forward/backward only fire for forward-axis (tank-style) movement.',
    parameters: [
      { name: "direction", type: "string", description: 'Filter by direction: "up", "down", "left", "right", "forward", "backward"', optional: true }
    ]
  },
  onRotate: {
    description: "When rotation direction changes",
    longDescription: "Triggers when this object starts rotating in a new direction. Fires each time the rotation direction changes (cw, ccw). Useful for triggering animations when steering.",
    validFor: ["object"],
    example: `onRotate "cw":
  set self.state "turnRight"
onRotate "ccw":
  set self.state "turnLeft"`,
    notes: 'Fires when rotation direction changes. Use direction parameter to filter: "cw" (clockwise), "ccw" (counter-clockwise). Without parameter, fires for any rotation change.',
    parameters: [
      { name: "direction", type: "string", description: 'Filter by direction: "cw", "ccw"', optional: true }
    ]
  },
  onStop: {
    description: "When movement stops",
    longDescription: "Triggers when this object stops moving (velocity becomes zero). Useful for resetting to idle state, snapping to grid, or playing stop animations.",
    validFor: ["object"],
    example: `onStop:
  set self.state "idle"`,
    notes: "Fires once when object comes to rest. Does not fire if object was already stopped."
  },
  onStopRotate: {
    description: "When rotation stops",
    longDescription: "Triggers when this object stops rotating. Useful for stopping rotation-linked animations or resetting state after steering.",
    validFor: ["object"],
    example: `onStopRotate:
  stop animate self "tracks"`,
    notes: "Fires once when object stops rotating. Does not fire if object was already not rotating."
  },
  onTick: {
    description: "Every physics frame",
    longDescription: "Triggers every physics frame (typically 60fps). Use for continuous logic like smooth rotation, custom movement, or checking conditions each frame. The deltaTime variable is available with the time elapsed since the last frame in seconds.",
    validFor: ["object"],
    example: `onTick:
  if turningLeft:
    set self.rotation self.rotation - 180 * deltaTime`,
    notes: "Runs every frame \u2014 keep logic lightweight. Use deltaTime for frame-rate independent calculations. Avoid wait/repeat inside onTick."
  },
  onJump: {
    description: "When object jumps",
    longDescription: "Triggers when this object performs a jump (jump key pressed while grounded or with remaining multi-jumps). Useful for playing jump animations or sounds.",
    validFor: ["object"],
    example: `onJump:
  set self.state "jumping"
  shake self 100`,
    notes: "Fires when jump is triggered, not when moving upward. Requires jumpable property."
  },
  onLanding: {
    description: "When object lands",
    longDescription: "Triggers when this object lands on a surface after being airborne. Useful for playing landing animations, sounds, or resetting jump state.",
    validFor: ["object"],
    example: `onLanding:
  set self.state "idle"
  shake self 50`,
    notes: "Fires when transitioning from airborne to grounded. Does not fire if already on ground."
  },
  onSpawn: {
    description: "When object is spawned",
    longDescription: 'Triggers when this object is created via the spawn command. Parameters passed to spawn via `spawn "Name" {key: value}` are available as local variables in the handler (e.g., `spawn "Bullet" {dir: 90, speed: 5}` makes `dir` and `speed` available). Use for initialization logic like setting position, color, or state. The special parameters `x` and `y` set spawn position directly.',
    validFor: ["object"],
    example: `onSpawn:
  set self.rotation dir
  enable self movable speed speed axis forward facing
  set self.color.color color`,
    parameters: [
      { name: "params", type: "object", description: 'Parameters from spawn command become local variables: spawn "Obj" {key: value} \u2192 key is available in handler', optional: true }
    ],
    notes: "Only fires on spawned objects (created at runtime). Template objects do not fire onSpawn. Spawn parameters {x, y} set position; all other params become local variables."
  },
  onDestroy: {
    description: "Before object is destroyed",
    longDescription: "Triggers before a spawned object is removed via the destroy command. Use for cleanup, animations, or effects. The handler blocks destruction until complete, allowing animations to finish.",
    validFor: ["object"],
    example: `onDestroy:
  shake self 200
  wait 200`,
    notes: "Blocks destruction until handler completes. Only fires on spawned objects."
  },
  onSubmit: {
    description: "When text input is submitted",
    longDescription: "Triggers when the user presses Enter in an editable text field. The updated text is already stored in self.content when this fires.",
    validFor: ["object"],
    example: `onSubmit:
  if self.content == "open sesame":
    show SecretDoor`,
    notes: "Only fires on text objects with editable enabled."
  },
  onDefocus: {
    description: "When text input loses focus",
    longDescription: "Triggers when an editable text field loses focus (user clicks elsewhere or presses Escape). The updated text is already stored in self.content.",
    validFor: ["object"],
    example: `onDefocus:
  if self.content == "":
    set self.content "Enter name..."`,
    notes: "Only fires on text objects with editable enabled."
  }
};
var COMBINED_EVENTS_INFO = {
  description: "Multiple events sharing same action",
  longDescription: "Use pipe (|) to make multiple events trigger the same action block. The events share the same click counter for sequential blocks.",
  example: `onClick | onKeyUp "space":
  show NextSlide`,
  notes: "Useful for making interactions work with both mouse and keyboard."
};
var ACTIONS = {
  goto: {
    description: "Navigate to cell",
    longDescription: `Navigates the player to a different cell. Can include a transition animation. The current cell's onExit runs first, then the target cell's onEnter. Supports directional navigation (north/east/south/west) based on map layout. Optional reset level: "clean" resets all objects but keeps variables, "fresh" resets everything (objects + variables).`,
    example: 'goto "NextRoom" clean with fade 500',
    parameters: [
      { name: "cell", type: "string", description: "Cell name, or direction: north, east, south, west" },
      { name: "resetLevel", type: "string", description: 'Reset level: "clean" (reset objects, keep vars) or "fresh" (reset everything)', optional: true },
      { name: "transition", type: "transition", description: "Animation type", optional: true },
      { name: "duration", type: "number", description: "Duration in ms (default 300)", optional: true }
    ],
    notes: 'Stops script execution. Use "goto north" etc. for map-based navigation. Reset levels: clean = reset objects/keep variables, fresh = reset everything.'
  },
  transition: {
    description: "Cell transition animation",
    longDescription: "Plays a transition animation on the entire cell. Use in onEnter to animate the cell appearing, or in onExit to animate it leaving. Overrides any transition specified on the incoming goto command.",
    example: `onEnter:
  transition fade 500

onExit:
  transition slide-up 300`,
    parameters: [
      { name: "type", type: "transition", description: "Animation type: fade, slide-up, slide-down, slide-left, slide-right, zoom" },
      { name: "duration", type: "number", description: "Duration in ms (default 300)", optional: true }
    ],
    notes: "The transition direction (in/out) is determined by the event context (onEnter = in, onExit = out)."
  },
  show: {
    description: "Make visible",
    longDescription: "Makes an object visible. Can include a transition animation. Use tags to show multiple objects at once.",
    example: "show MyButton with fade 300",
    parameters: [
      { name: "target", type: "string", description: "Object name or #tag" },
      { name: "transition", type: "transition", description: "Animation type", optional: true },
      { name: "duration", type: "number", description: "Duration in ms (default 300)", optional: true }
    ],
    notes: "Use #tagName to show all objects with that tag. Use self.ChildName to show a child of the current component."
  },
  hide: {
    description: "Make hidden",
    longDescription: "Hides an object. Can include a transition animation. Hidden objects are invisible in play mode but still exist.",
    example: "hide ErrorMessage with fade 200",
    parameters: [
      { name: "target", type: "string", description: "Object name or #tag" },
      { name: "transition", type: "transition", description: "Animation type", optional: true },
      { name: "duration", type: "number", description: "Duration in ms (default 300)", optional: true }
    ],
    notes: "Use #tagName to hide all objects with that tag. Use self.ChildName to hide a child of the current component."
  },
  wait: {
    description: "Pause execution",
    longDescription: 'Pauses script execution for the specified duration, or until movement settles. Use "wait movement" to pause until all movable objects have stopped. Use "wait movement self" to wait only for the current object to stop - useful when many objects move independently.',
    example: `wait 2000
wait 2s
wait movement
wait movement self`,
    parameters: [
      { name: "duration", type: "number", description: 'Time in milliseconds (or use "2s" for seconds), or "movement" to wait for dynamics' },
      { name: "target", type: "string", description: 'Optional object name after "movement" \u2014 waits only for that object (e.g., "self")', optional: true }
    ],
    notes: 'Use "wait movement" to wait for all objects, "wait movement self" to wait only for the current object.'
  },
  set: {
    description: "Set variable or property",
    longDescription: "Sets a variable value or an object property. Variables can be scoped (session, game, local). Object properties change visual appearance at runtime. Use `over DURATION` for smooth tweening. When setting `state`, the state's delta is applied as a composable patch (only the changed properties are written). Optional spatial modifiers filter which properties are applied.",
    example: `set score 100
set game.highScore 999
set Button1.opacity 0.5
set self.opacity 0 over 500
set self.fillColor "#ff0000" over 1000 ease-in-out
set self.x 0.8 over 300 ease-out
set self.state RED
set self.state RED over 500
set self.state RED position over 300 ease-out cw
set self.state BLUE none
set self.state BLUE position rotate
set self.state BLUE offset
set self.state next`,
    parameters: [
      { name: "target", type: "string", description: "Variable name or Object.property" },
      { name: "value", type: "any", description: "Value to set (number, string, boolean, or expression)" },
      { name: "modifiers", type: "string", description: "For state only: none/position/rotate/scale/offset (spatial filter). Combinable. Optional." },
      { name: "over", type: "number", description: "Tween duration in ms for smooth transition. Optional.", optional: true },
      { name: "easing", type: "string", description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic. Optional.", optional: true },
      { name: "cw|ccw", type: "keyword", description: "For state tweens: force rotation direction. Optional.", optional: true }
    ],
    notes: 'Scopes: session (default, cleared on reset), game (persists), local (persists forever). State modifiers: "none" excludes all spatial props, "position" includes x/y, "rotate" includes rotation/flip, "scale" includes width/height, "offset" includes offsetX/offsetY (relative displacement from reference position). Modifiers are combinable: "position rotate" includes both position and rotation properties. Tween: `set X.prop value over DURATION [easing]` smoothly transitions to the target. Fire-and-forget; script continues. A subsequent instant `set` cancels the tween. For state tweens, modifiers come before `over`.'
  },
  reset: {
    description: "Reset game state",
    longDescription: 'Resets variables, visit history, and/or objects. Different scopes clear different data. "objects" resets all objects on the current cell (positions, visibility, states, spawned objects) but keeps variables. "fresh" resets everything (objects + variables). Useful for restarting a game or clearing progress.',
    example: "reset game",
    parameters: [
      { name: "scope", type: "string", description: 'What to reset: "session", "game", "all", "objects", "fresh", or cell name' }
    ],
    notes: '"session" clears session vars + visits. "game" clears game vars. "all" clears everything. "objects" resets objects on current cell, keeps variables. "fresh" resets objects + variables on current cell.'
  },
  "reset script": {
    description: "Reset click counter",
    longDescription: "Resets the click counter for sequential onClick blocks back to the beginning. Allows onClick sequences to loop instead of stopping after the last block.",
    example: `onClick:
  show Step1
onClick:
  show Step2
onClick:
  hide Step2
  reset script`,
    parameters: [],
    notes: "Place at the end of a sequence to make it loop."
  },
  endGame: {
    description: "Exit play mode",
    longDescription: "Ends the game and exits play mode. In the studio, returns to build mode. In the player, stops the game.",
    example: `onClick:
  endGame`,
    parameters: [],
    notes: 'Use for "quit game" buttons or end-of-game flows.'
  },
  restart: {
    description: "Restart from start cell",
    longDescription: 'Navigates to the start cell and performs a full reset (objects + variables). Equivalent to "goto StartCell fresh". Use for "game over / play again" functionality.',
    example: `onClick:
  restart`,
    parameters: [],
    notes: 'Resets everything and goes back to the start cell. For staying on the current cell, use "reset objects" or "reset fresh" instead.'
  },
  save: {
    description: "Save game to named slot",
    longDescription: "Saves the current game state (objects, variables, cell position) to a named save slot in localStorage. Overwrites any existing save in that slot.",
    example: `onClick:
  save "checkpoint"`,
    parameters: [
      { name: "slotName", type: "string", description: "Name of the save slot" }
    ],
    notes: "Save slots persist across browser sessions. Use hasSave() to check if a slot exists before loading."
  },
  load: {
    description: "Load game from named slot",
    longDescription: "Restores game state from a previously saved slot. Navigates to the saved cell and restores all objects, variables, and visit history. Silently does nothing if the slot does not exist.",
    example: `onClick:
  if hasSave("checkpoint"):
    load "checkpoint"`,
    parameters: [
      { name: "slotName", type: "string", description: "Name of the save slot to load" }
    ],
    notes: "Interrupts script execution and navigates to the saved cell. Like goto, no statements after load will execute."
  },
  "delete save": {
    description: "Delete a save slot",
    longDescription: "Removes a named save slot from localStorage. Silently does nothing if the slot does not exist.",
    example: `onClick:
  delete save "checkpoint"`,
    parameters: [
      { name: "slotName", type: "string", description: "Name of the save slot to delete" }
    ],
    notes: 'Cannot be undone. Use to clear old saves or implement a "New Game" flow.'
  },
  return: {
    description: "Exit action/handler early",
    longDescription: "Exits the current action or event handler immediately. Useful for early returns when a condition is met, avoiding deeply nested if statements. Does not stop other handlers from running.",
    example: `action checkWin:
  if not gameStarted:
    return
  // ... check win logic`,
    parameters: [],
    notes: "Only exits the current action or handler, not the entire script."
  },
  break: {
    description: "Exit loop early",
    longDescription: "Exits the innermost foreach or repeat loop immediately. Useful when you find what you are looking for or want to stop a repeat loop based on a condition.",
    example: `foreach item in items:
  if item.found:
    set result item
    break`,
    parameters: [],
    notes: "Only exits the innermost loop. Works in both foreach and repeat."
  },
  clear: {
    description: "Clear grid cell data",
    longDescription: "Clears data stored in grid cells. Can clear an entire grid or a specific cell. Grid cell data is runtime storage for arbitrary values per cell - separate from visual objects.",
    example: `// Clear entire grid
clear Board

// Clear specific cell
clear Board.cell[2][3]`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "cell[x][y]", type: "cell coords", description: "Optional: specific cell to clear", optional: true }
    ],
    notes: 'Grid cell data is cleared automatically on reset("session").'
  },
  "enable pageable": {
    description: "Create pageable sequence",
    longDescription: "Creates a pageable component that cycles through its children, showing one at a time. When created, the first item is shown and others are hidden. Use next/prev to navigate. You can either list items explicitly or omit the brackets to use the component's children order.",
    example: `enable Slideshow pageable [Intro, Step1, Step2, Step3]
// Or use children order:
enable Slideshow pageable`,
    parameters: [
      { name: "target", type: "string", description: "Component name, self, siblings, children, #tag" },
      { name: "items", type: "string[]", description: "List of object names to cycle through (optional - omit brackets to use component children)" }
    ],
    notes: "First item shown by default. Omit [items] to use the component's children sorted by z-index."
  },
  next: {
    description: "Next pageable item",
    longDescription: 'Advances to the next item in a pageable. Hides the current item and shows the next one. Use "wrap" to loop from last to first, or "else" for end action.',
    example: `next Slideshow with fade wrap`,
    parameters: [
      { name: "target", type: "string", description: "Pageable name" }
    ],
    notes: 'Add "wrap" to loop, or "else <action>" for end behavior.'
  },
  prev: {
    description: "Previous pageable item",
    longDescription: 'Goes back to the previous item in a pageable. Hides the current item and shows the previous one. Use "wrap" to loop from first to last, or "else" for start action.',
    example: `prev Slideshow with fade wrap`,
    parameters: [
      { name: "target", type: "string", description: "Pageable name" }
    ],
    notes: 'Add "wrap" to loop, or "else <action>" for start behavior.'
  },
  wrap: {
    description: "Wrap pageable to first item",
    longDescription: 'Wraps a pageable back to its first item. Useful inside "else" blocks of next/prev to wrap AND perform additional actions.',
    example: `next Slideshow else:
  wrap Slideshow
  show LoopIndicator`,
    parameters: [
      { name: "target", type: "string", description: "Pageable name to wrap" }
    ],
    notes: "Can be used standalone or inside else blocks. Supports transitions: wrap Slideshow with fade"
  },
  shout: {
    description: "Broadcast message",
    longDescription: "Broadcasts a message project-wide. Any object with a matching onMessage handler will react, regardless of which cell it is in. Objects CAN hear their own shouts, but infinite loops are blocked (cannot shout the same message from within its handler). Can include parameters that handlers can access as variables.",
    example: `shout "KEY_PICKED_UP"
shout "DAMAGE" {amount: 50, source: "enemy"}
shout "SCORE_CHANGED" {newScore: score}`,
    parameters: [
      { name: "message", type: "string", description: "Message to broadcast" },
      { name: "params", type: "object", description: "Parameters to pass {key: value}", optional: true }
    ],
    notes: "Parameters are accessed as variables in handler: `if amount > 10:`"
  },
  "shout to": {
    description: "Send message to target",
    longDescription: "Sends a message to a specific object or all objects with a tag. Only matching targets will receive the message. Useful for direct communication between known objects.",
    example: `shout to Player "HEAL" {amount: 25}
shout to #enemies "FREEZE"
shout to HealthBar "UPDATE" {value: health}`,
    parameters: [
      { name: "target", type: "string", description: "Object name or #tag" },
      { name: "message", type: "string", description: "Message to send" },
      { name: "params", type: "object", description: "Parameters to pass {key: value}", optional: true }
    ],
    notes: "Use #tagName to target all objects with that tag."
  },
  press: {
    description: "Synthetic key press",
    longDescription: 'Injects a synthetic key-down event. When called from an object script, fires onKeyDown on that object only. When called from a cell script, fires globally. Use `on` to target a specific object. The key stays "held" until a matching `release` is called. If already held, this is a no-op.',
    example: `press "q"
press "Space"
press "e" on EnemyTank`,
    parameters: [
      { name: "key", type: "string", description: 'Key name (e.g. "q", "Space", "ArrowUp")' },
      { name: "target", type: "string", description: "Object to inject into (default: self)", optional: true }
    ],
    notes: "Works with existing onKeyDown handlers. Same object can receive both physical and synthetic key events."
  },
  release: {
    description: "Synthetic key release",
    longDescription: "Injects a synthetic key-up event. Clears the held state set by `press` and fires onKeyUp on the target object. If the key is not currently held, this is a no-op.",
    example: `release "q"
release "Space"
release "e" on EnemyTank`,
    parameters: [
      { name: "key", type: "string", description: "Key name matching a previous press" },
      { name: "target", type: "string", description: "Object to target (default: self)", optional: true }
    ],
    notes: "All synthetic keys are auto-released on play mode exit."
  },
  post: {
    description: "Send data to URL",
    longDescription: "Sends JSON data to an external URL via HTTP POST. Use for submitting scores, saving progress, or integrating with external services. Sets httpError variable on failure.",
    example: `post "https://api.example.com/scores" {name: playerName, score: finalScore}`,
    parameters: [
      { name: "url", type: "string", description: "URL to send data to" },
      { name: "data", type: "object", description: "Data to send as JSON {key: value}" }
    ],
    notes: "Sets httpError variable if request fails. Requires CORS headers on receiving server."
  },
  fetch: {
    description: "Get data from URL",
    longDescription: "Fetches JSON data from an external URL via HTTP GET and stores it in a variable. Use for loading leaderboards, configurations, or dynamic content. Sets httpError variable on failure.",
    example: `fetch "https://api.example.com/scores" into highscores`,
    parameters: [
      { name: "url", type: "string", description: "URL to fetch data from" },
      { name: "variable", type: "string", description: "Variable name to store result" }
    ],
    notes: "Sets httpError variable if request fails. Requires CORS headers on server."
  },
  spawn: {
    description: "Create runtime object from template",
    longDescription: 'Creates a new object at runtime by cloning a template object. The template is any existing object in the cell (typically hidden). Parameters are passed to the onSpawn handler on the spawned object. Spawned objects are cleared on reset("session") or cell exit. Use `at AnchorName` to spawn at an anchor\'s position and rotation \u2014 if the anchor is inside a component, the spawned object becomes a child of that component.',
    example: `spawn "PieceTemplate" {col: 3, row: 5, color: "red"}
spawn "Bullet" at MuzzlePoint
spawn "Bullet" at MuzzlePoint {vx: 1, vy: 0}`,
    parameters: [
      { name: "template", type: "string", description: "Name of the template object to clone" },
      { name: "at", type: "string", description: "Anchor name \u2014 spawns at anchor position/rotation. If anchor is inside a component, spawned object becomes a child of that component", optional: true },
      { name: "params", type: "object", description: "Parameters passed to onSpawn handler {key: value}", optional: true }
    ],
    notes: "Template should be hidden (buildVisible: false). Spawned objects inherit template properties including scripts."
  },
  destroy: {
    description: "Remove object from scene",
    longDescription: "Removes an object from the scene. Works on both spawned and design-time objects. Fires onDestroy handler first and waits for it to complete (allowing death animations). Can include a transition animation. Design-time objects reappear on cell reset or restart; spawned objects do not.",
    example: `destroy piece
destroy self
destroy Enemy with fade 300
destroy self with scale 200`,
    parameters: [
      { name: "target", type: "object", description: "The object to destroy (name, variable, self, other, #tag)" },
      { name: "transition", type: "transition", description: "Animation type", optional: true },
      { name: "duration", type: "number", description: "Duration in ms (default 300)", optional: true }
    ],
    notes: "Design-time objects reappear on reset/restart. Use hide for temporary visibility changes."
  },
  copy: {
    description: "Copy to clipboard",
    longDescription: "Copies a value to the system clipboard. Must be triggered by a user action (onClick, onKeyDown, etc.) due to browser security requirements. Useful for sharing generated values, codes, or results.",
    example: `onClick:
  copy seed

onClick:
  copy Result.content`,
    parameters: [
      { name: "value", type: "any", description: "Value to copy (variable, property, or expression)" }
    ],
    notes: "Only works from user-initiated events (onClick, onKeyDown). Fails silently from onEnter or timers."
  },
  // Animation actions
  shake: {
    description: "Shake animation",
    longDescription: "Plays a shake animation on the target object. The object shakes horizontally for the specified duration. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.",
    example: `shake Button 200
shake self 500 loop
shake #enemies 300`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true }
    ]
  },
  vibrate: {
    description: "Vibrate animation",
    longDescription: "Plays a rapid vibration animation on the target object. Higher frequency than shake. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.",
    example: `vibrate Phone 500
vibrate self loop
vibrate #alerts 200 loop`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true }
    ]
  },
  pulse: {
    description: "Pulse animation",
    longDescription: "Plays a pulsing scale animation on the target object. The object grows and shrinks rhythmically. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.",
    example: `pulse Heart 1000
pulse self 2000 loop
pulse #collectibles 500`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true }
    ]
  },
  squeeze: {
    description: "Squeeze animation",
    longDescription: "Plays a squash-and-stretch animation on the target object. The object compresses and expands. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.",
    example: `squeeze Slime 400
squeeze self 800 loop
squeeze #bouncy 300`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true }
    ]
  },
  bounce: {
    description: "Bounce animation",
    longDescription: "Plays a bouncing animation on the target object. The object moves up and down. Add `loop` to repeat the cycle indefinitely. Supports tags and all-type selectors.",
    example: `bounce Ball 600
bounce self 1000 loop
bounce #items 400`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true }
    ]
  },
  spin: {
    description: "Spin animation",
    longDescription: "Plays a spinning rotation animation on the target object. The object rotates 360 degrees. Add `loop` to repeat the cycle indefinitely. On components, rotates the whole group as a unit; add `children` to apply per-child instead. Supports tags and all-type selectors.",
    example: `spin Gear 1000
spin self 2000 loop
spin #wheels 500 loop cw
spin MyComponent 1000 loop children`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true },
      { name: "children", type: "keyword", description: "Apply per-child on components (each child animates individually)", optional: true }
    ]
  },
  glow: {
    description: "Glow animation",
    longDescription: "Plays a pulsing glow effect on the target object. The glow radiates from the object edges. Add `loop` to repeat the cycle indefinitely. Optional color parameter. Supports tags and all-type selectors.",
    example: `glow Button 1000
glow self 2000 loop
glow self 1500 loop "#ff0000"`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" },
      { name: "duration", type: "number", description: "Cycle duration in ms (default 300)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat the cycle indefinitely", optional: true },
      { name: "color", type: "string", description: "Glow color (default: object glowColor or white)", optional: true }
    ]
  },
  screenshake: {
    description: "Screen shake effect",
    longDescription: "Shakes the entire camera/viewport. Useful for impact, explosions, earthquakes. Supports intensity range (e.g., `1-5`) for ramping effects. Non-looping shakes naturally damp to zero. `stop screenshake` to stop.",
    example: `screenshake 300
screenshake 500 loop
screenshake 200 5
screenshake 2000 1-5
stop screenshake`,
    parameters: [
      { name: "duration", type: "number", description: "Duration in ms (default 300)" },
      { name: "intensity", type: "number", description: "Shake intensity or range A-B (default 3)", optional: true },
      { name: "loop", type: "keyword", description: "Repeat indefinitely", optional: true }
    ]
  },
  stop: {
    description: "Stop animation or audio",
    longDescription: "Stops any currently playing animation or audio on the target object. For audio, resets playback to the beginning. Supports tags and all-type selectors.",
    example: `stop Gear
stop #wheels
stop Music`,
    parameters: [
      { name: "target", type: "string", description: "Object name, #tag, or all type" }
    ]
  },
  play: {
    description: "Play audio",
    longDescription: "Starts playback on an audio object. Optionally loop continuously. If audio was paused, resumes from the paused position.",
    example: `play Music
play SoundEffect loop`,
    parameters: [
      { name: "target", type: "string", description: "Audio object name" },
      { name: "loop", type: "keyword", description: "Loop playback continuously", optional: true }
    ]
  },
  pause: {
    description: "Pause audio",
    longDescription: "Pauses playback on an audio object. Playback position is preserved and can be resumed with play.",
    example: "pause Music",
    parameters: [
      { name: "target", type: "string", description: "Audio object name" }
    ]
  },
  jump: {
    description: "Trigger jump impulse",
    longDescription: "Triggers a jump impulse on an object regardless of input. The object must have jumpable enabled. Bypasses key input and multi-jump counter \u2014 the designer explicitly controls when it fires.",
    example: `jump self
jump Player
jump Player height 0.8`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, other, #tag" },
      { name: "height", type: "number", description: "Optional jump height override", optional: true }
    ],
    notes: "Object must have jumpable enabled (via properties panel or `enable Object jumpable`). Fires the onJump event."
  },
  impulse: {
    description: "Add velocity to object",
    longDescription: "Adds velocity to an object. Additive \u2014 accumulates with existing velocity. Use `set Object.velocityX` for absolute velocity. Object must be movable (have a RuntimeState).",
    example: `impulse self 0.3 -0.5
impulse Ball random(-0.2, 0.2) -0.5
impulse #enemies 0.1 0`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, other, #tag" },
      { name: "vx", type: "number", description: "Velocity X to add (rightward positive)" },
      { name: "vy", type: "number", description: "Velocity Y to add (downward positive)" }
    ]
  },
  transport: {
    description: "Smooth position tween",
    longDescription: "Smoothly moves an object from its current position to target (x, y) over a duration. Real position updates each frame \u2014 sensors and overlaps fire during transit. Does not require movable. Physics is bypassed during transport.",
    example: `transport self to 0.5 0.5 over 1000
transport Player to 0.2 0.8 over 500 ease-in-out
transport #enemies to Player.x Player.y over 300`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, other, #tag" },
      { name: "x", type: "expression", description: "Target X position (0-1)" },
      { name: "y", type: "expression", description: "Target Y position (0-1)" },
      { name: "duration", type: "expression", description: "Duration in milliseconds" },
      { name: "easing", type: "string", description: "Optional: ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic", optional: true }
    ],
    notes: "No collision \u2014 passes through blockers. Physics resumes after transport completes. New transport on same object replaces the old one. `set X.x` cancels transport."
  },
  moveTo: {
    description: "Move to position or object (physical)",
    longDescription: "Moves an object toward a target position or another object using its movable speed. Obeys physics \u2014 collides with blockers, affected by gravity. Object must have movable enabled. Fires onMove/onStop events.",
    example: `moveTo self 0.5 0.5
moveTo Player 0.2 0.8
moveTo #enemies Player.x Player.y
moveTo self Checkpoint
moveTo #enemies Flag`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, other, #tag" },
      { name: "x or destination", type: "expression", description: "Target X (0-1), or object name to move toward" },
      { name: "y", type: "expression", description: "Target Y (0-1) \u2014 omit when using object name", optional: true }
    ],
    notes: "Uses movable speed. Collides normally. Arrival not guaranteed (walls may block). Keyboard/gamepad input overrides moveTo. When destination is an object name, its current position is used."
  },
  log: {
    description: "Debug log",
    longDescription: "Writes a message to the debug console. Useful for debugging scripts during development. Values and expressions are evaluated before logging.",
    example: `log "Player position: " Player.x ", " Player.y
log "Score: " score`,
    parameters: [
      { name: "values", type: "any...", description: "Values to log (concatenated)" }
    ],
    notes: "Visible in the debug panel (View > Debug Console)."
  },
  foreach: {
    description: "Iterate over collection",
    longDescription: "Loops over an array or tagged objects, executing the body for each item. The loop variable holds the current item. Use `break` to exit early.",
    example: `foreach item in emptyCells("Board"):
  log item.x ", " item.y

foreach enemy in #enemies:
  set enemy.opacity 0.5`,
    parameters: [
      { name: "variable", type: "string", description: "Loop variable name" },
      { name: "collection", type: "array|#tag", description: "Array, function result, or #tag selector" }
    ],
    notes: 'Use `break` to exit early. Avoid using "cell" as variable name (conflicts with grid syntax).'
  },
  repeat: {
    description: "Repeat block forever or N times",
    longDescription: "Executes statements repeatedly. Without a count, loops forever until `break` or cell exit. The loop reads live variables each iteration \u2014 any variable set by another event (onClick, onMessage, etc.) is visible on the next iteration. Must contain `wait` in infinite loops to avoid freezing.",
    example: `repeat:
  spawn "Particle" {x: random, y: 0}
  wait 100ms

repeat 3:
  show Hint
  wait 1s
  hide Hint`,
    parameters: [
      { name: "count", type: "number", description: "Optional iteration limit (omit for infinite)" }
    ],
    notes: "Use `break` to exit. Stops automatically on cell exit. Infinite loops without `wait` will freeze the browser."
  },
  "first...where": {
    description: "Find first matching tagged object",
    longDescription: "Finds the first object with the given tag that matches a condition. Assigns it to a variable for use in subsequent statements. The dot before the property name is optional.",
    example: `first #tiles where visible == true:
  set found item
  hide item

first #enemies where health <= 0:
  destroy item`,
    parameters: [
      { name: "tag", type: "#tag", description: "Tag selector to search" },
      { name: "property", type: "string", description: "Property to check (dot optional)" },
      { name: "operator", type: "string", description: "Comparison operator" },
      { name: "value", type: "any", description: "Value to compare against" }
    ],
    notes: "The matched object is available as `item` inside the block."
  },
  "action (custom)": {
    description: "Define custom action",
    longDescription: "Defines a reusable named action block that can be called from anywhere in the cell. Actions are cell-scoped subroutines \u2014 define once on any object (or the cell script), call with `do actionName` from any script. The caller's `self` is preserved.",
    example: `// Define on any object:
action dropPiece:
  set Board.cell[col][row].owner currentPlayer
  spawn "Piece" {col: col, row: row}

// Call from any script in the cell:
do dropPiece
do checkWin`,
    parameters: [
      { name: "name", type: "string", description: "Action name (no spaces)" }
    ],
    notes: "Variables are shared between caller and action. `self` refers to the calling object, not the defining object. First matching definition in the cell wins."
  },
  "enable movable": {
    description: "Enable movement",
    longDescription: "Configures an object for dynamics-based movement. Supports continuous movement with speed/acceleration or grid-snapped movement. Supports multi-target (siblings, children, #tag).",
    example: `enable Player movable speed 0.3
enable Paddle movable speed 0.5 axis x
enable Ball movable speed 0.3 path Track
enable Ship movable speed 0.3 facing
enable Tank movable speed 0.3 axis forward
enable siblings movable speed 0.5
disable Player movable`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "config", type: "keywords", description: "speed N (0.1\u20132, default 0.3), acceleration N (0.1\u201320, default 10), deceleration N (0\u20131, default 0.15), style teleport|slide|fade|jump, axis x|y|forward, steer N (turn rate multiplier, default 1), path ObjectName, facing" }
    ],
    notes: "Defaults: speed 0.3, acceleration 10, deceleration 0.15. Deceleration is 0\u20131 where 0=no decel (coast forever), 1=instant stop. Typical values: 0.05 (icy), 0.15 (normal), 0.5 (heavy). Use axis x or axis y to constrain movement to one axis. Use axis forward for tank-style controls where up/down moves along the facing direction and left/right rotates the body (rotation rate proportional to speed). Use path ObjectName to constrain movement along a path/curve shape. Use facing to auto-rotate the object toward its movement direction (smooth lerp, right side = front at 0\xB0). Mutually exclusive with rotatable physics."
  },
  "disable movable": {
    description: "Disable movement",
    longDescription: "Removes movement capability from an object.",
    example: `disable Player movable`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable jumpable": {
    description: "Enable jumping",
    longDescription: "Configures an object to jump when the jump key is pressed. Requires movable. Supports multi-jump and custom jump height.",
    example: `enable Player jumpable height 0.8
enable Player jumpable height 0.6 multijump 2
disable Player jumpable`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "config", type: "keywords", description: 'height N (0.1\u20132, default 0.5), multijump N (1\u20135, default 1), key "Key"' }
    ],
    notes: "Requires movable. Jump key is Space by default. Height is in normalized units (1 = full canvas height)."
  },
  "disable jumpable": {
    description: "Disable jumping",
    longDescription: "Removes jump capability from an object.",
    example: `disable Player jumpable`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable draggable": {
    description: "Enable drag",
    longDescription: "Makes an object draggable by the user. Options: once (single drag), collision (respect blockers), discrete (cell-by-cell), occupy (reject if cell taken).",
    example: `enable Piece draggable
enable Piece draggable discrete occupy collision`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "config", type: "keywords", description: "once, collision, discrete, occupy" }
    ],
    notes: "Fires onDragStart, onDrag, onDragEnd events."
  },
  "disable draggable": {
    description: "Disable drag",
    longDescription: "Removes drag capability from an object.",
    example: `disable Piece draggable`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable keyboard": {
    description: "Enable keyboard input",
    longDescription: "Adds keyboard input (WASD + arrows) to a movable object. Multiple input types can be active simultaneously.",
    example: `enable Player keyboard`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ],
    notes: "Keyboard + gamepad can be active at the same time. Click-to-move is used as fallback when no directional input."
  },
  "enable click": {
    description: "Enable click-to-move input",
    longDescription: "Adds click-to-move input to a movable object. Object moves toward click position.",
    example: `enable Player click`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable gamepad": {
    description: "Enable gamepad input",
    longDescription: "Adds gamepad input (left stick + D-pad) to a movable object. Multiple input types can be active simultaneously.",
    example: `enable Player gamepad`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable script": {
    description: "Enable script-only input",
    longDescription: "Adds script input to a movable object. The object only receives synthetic keys via press/release \u2014 physical keyboard is ignored. Use for AI-controlled objects.",
    example: `enable Tank script`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "disable keyboard": {
    description: "Disable keyboard input",
    longDescription: "Removes keyboard input from a movable object.",
    example: `disable Player keyboard`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "disable click": {
    description: "Disable click-to-move input",
    longDescription: "Removes click-to-move input from a movable object.",
    example: `disable Player click`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "disable gamepad": {
    description: "Disable gamepad input",
    longDescription: "Removes gamepad input from a movable object.",
    example: `disable Player gamepad`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "disable script": {
    description: "Disable script-only input",
    longDescription: "Removes script input from a movable object.",
    example: `disable Tank script`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable subject": {
    description: "Enable camera follow",
    longDescription: "Makes the camera follow the specified object. The viewport scrolls to keep the subject centered.",
    example: `enable Player subject`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ],
    notes: "Cell must be larger than viewport to see effect."
  },
  "disable subject": {
    description: "Disable camera follow",
    longDescription: "Stops the camera from following the specified object.",
    example: `disable Player subject`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable follow": {
    description: "Follow a target object",
    longDescription: "Makes a movable object autonomously steer toward a target. The object uses its existing movable config (speed, acceleration, axis constraint, collision). Manual input (keyboard, gamepad) overrides follow direction. With distance, the object maintains that gap \u2014 approaches when far, retreats when too close (shy follow). For steered objects (axis forward), the AI turns toward the target and drives forward instead of applying direct force. Arrival deceleration smoothly slows approach. Dead zone prevents fidgeting at the target distance.",
    example: `enable Dog follow "Player"
enable Dog follow "Player" distance 0.15
enable Guard follow "Player" distance 0.2
enable Tank follow "Player" arrival 0.15
enable Tank follow "Player" delay 2000
enable #enemies follow "Player"
disable Dog follow`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag (who follows)" },
      { name: "object", type: "string", description: "Target object name to follow (required)" },
      { name: "distance", type: "number", description: "Preferred distance to maintain (0\u20131, default: 0 = reach target). Object stops when within distance." },
      { name: "deadZone", type: "number", description: "Stop within this distance of target (0\u20131, default: 0.03). Prevents fidgeting at the target distance." },
      { name: "arrival", type: "number", description: "Begin decelerating within this distance of target (0\u20131, default: 0.12). Auto-scales to at least the follow distance." },
      { name: "delay", type: "number", description: "Milliseconds to wait before follow activates (default: 0). Gives target time to build a path." },
      { name: "pathfinding", type: "flag", description: "Reserved for future obstacle avoidance" }
    ],
    notes: "Requires movable. For steered objects (axis forward), uses steering logic \u2014 turns toward target and drives forward. For free-moving objects, applies direct force. Dead zone and arrival deceleration apply to both modes. Use avoid instead of follow to only flee from target."
  },
  "enable avoid": {
    description: "Avoid a target object",
    longDescription: "Makes a movable object autonomously steer away from a target. When distance is set, the object only flees when closer than that distance. For steered objects (axis forward), the AI turns away from the target and drives forward. IMPORTANT: always specify a distance \u2014 without it, the object flees forever and never stops.",
    example: `enable Enemy avoid "Player" distance 0.3
enable Enemy avoid "Player" distance 0.5 arrival 0.1
disable Enemy follow`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag (who avoids)" },
      { name: "object", type: "string", description: "Target object name to avoid (required)" },
      { name: "distance", type: "number", description: "Awareness radius \u2014 flee only when closer than this (0.1\u20131, default: 0 = always flee). Always specify this for avoid." },
      { name: "deadZone", type: "number", description: "Stop within this distance of safe zone (0\u20131, default: 0.015)." },
      { name: "arrival", type: "number", description: "Begin decelerating within this distance of safe zone (0\u20131, default: 0.08)." }
    ],
    notes: "Requires movable. Always specify distance for avoid (e.g. 0.3) so the object stops fleeing once far enough away. Without distance, the object flees indefinitely. disable X follow stops both follow and avoid."
  },
  "disable follow": {
    description: "Stop following/avoiding",
    longDescription: "Removes follow or avoid behavior from an object.",
    example: `disable Dog follow`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable zone": {
    description: "Create a physics zone",
    longDescription: "Makes an object act as a physics zone \u2014 a region where physics rules differ from the cell defaults. Objects whose center point falls inside the zone get overridden physics. Any omitted parameter uses the cell default. Smallest zone wins when multiple zones overlap. Per-object modifiers (gravityScale, windScale, dragScale) still apply as multipliers on top of zone values.",
    example: `enable WaterRegion zone gravity 0.3 airResistance 0.8
enable WindTunnel zone wind 5 windAngle 0
enable IcePatch zone friction 0
enable Conveyor zone flowX 0.3
enable SpacePocket zone gravity 0 airResistance 0
enable WaterRegion zone gravity 0.3 affects #swimmer
enable WindTunnel zone wind 5 affects #light #paper`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "gravity", type: "number", description: "Override cell gravity (0\u201310, 0 = weightless, default 1)", optional: true },
      { name: "wind", type: "number", description: "Override cell wind magnitude (0\u201310)", optional: true },
      { name: "windAngle", type: "number", description: "Override cell wind direction in degrees (0=right, 90=down, 0\u2013360)", optional: true },
      { name: "airResistance", type: "number", description: "Override cell drag coefficient (0\u20131, 0=vacuum, 1=thick)", optional: true },
      { name: "friction", type: "number", description: "Override contact friction (0\u20131, 0=ice, 1=sticky)", optional: true },
      { name: "flowX", type: "number", description: "Constant horizontal drift in units/sec (-2 to 2, mass-independent)", optional: true },
      { name: "flowY", type: "number", description: "Constant vertical drift in units/sec (-2 to 2, mass-independent)", optional: true },
      { name: "affects", type: "string", description: "One or more #tags \u2014 zone only affects objects with a matching tag (omit for all objects)", optional: true }
    ],
    notes: "Zone object needs a collision shape (any rectangle, polygon, ellipse, or path). Flow is velocity (mass-independent drift like conveyors/currents). Wind is force (mass-dependent acceleration). Re-enable with new values to change zone config dynamically. Use `affects #tag` to filter which objects are affected (OR logic \u2014 any matching tag qualifies). Omit affects for all objects (default)."
  },
  "disable zone": {
    description: "Deactivate a physics zone",
    longDescription: "Removes zone behavior from an object. Physics reverts to cell defaults for objects that were inside.",
    example: `disable WaterRegion zone`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable blocking": {
    description: "Enable collision blocking on an object",
    longDescription: "Makes an object block other objects from passing through it. Optionally filter by tags so only certain movers are blocked.",
    example: `enable Wall blocking
enable Wall blocking affects #tank #player
enable #walls blocking affects #tank`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "affects", type: "string", description: "One or more #tags \u2014 only blocks movers with a matching tag (omit to block all)", optional: true }
    ],
    notes: "Object needs a collision shape. Use `affects #tag` for selective blocking (OR logic). Omit affects to block everything (default)."
  },
  "disable blocking": {
    description: "Disable collision blocking",
    longDescription: "Removes blocking behavior from an object. Other objects can now pass through it.",
    example: `disable Wall blocking`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable sensor": {
    description: "Enable overlap detection on an object",
    longDescription: "Makes an object detect overlaps with other objects, firing onOverlap/onOverlapEnd events. Optionally filter by tags so only certain objects trigger overlap events.",
    example: `enable Goal sensor
enable Goal sensor affects #ball
enable #detectors sensor affects #player`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "affects", type: "string", description: "One or more #tags \u2014 only detects objects with a matching tag (omit to detect all)", optional: true }
    ],
    notes: "Object needs a collision shape. Use `affects #tag` for selective sensing (OR logic). Omit affects to sense everything (default)."
  },
  "disable sensor": {
    description: "Disable overlap detection",
    longDescription: "Removes sensor behavior from an object. Overlap events will no longer fire.",
    example: `disable Goal sensor`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "enable phase": {
    description: "Enable phasing through blockers",
    longDescription: "Makes an object pass through blocking objects. Without affects, phases through everything. With affects, only phases through blockers that have a matching tag.",
    example: `enable Bullet phase
enable Bullet phase affects #boundary
enable self phase affects #wall #fence`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" },
      { name: "affects", type: "string", description: "One or more #tags \u2014 only phases through blockers with a matching tag (omit to phase through all)", optional: true }
    ],
    notes: "Use `affects #tag` for selective phasing (OR logic). Without affects, object ignores all collisions."
  },
  "disable phase": {
    description: "Disable phasing (resume normal collisions)",
    longDescription: "Removes phasing from an object. It will collide with blockers normally again.",
    example: `disable Bullet phase`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, siblings, children, parent, #tag" }
    ]
  },
  "animate (group)": {
    description: "Animate through a state group",
    longDescription: "Plays a state group animation \u2014 cycling through the group's states in order. Frame mode snaps between states at a given FPS. Tween mode smoothly interpolates between states. Rotation uses shortest-path by default; use cw/ccw to force direction.",
    example: `animate self "walk"
animate self "walk" fps 12
animate self "walk" once
animate self "walk" pingpong
animate self "hover" duration 500
animate self "hover" duration 300 ease-in-out
animate self "spin" loop cw
animate self "walk" loop resume
animate self "run" loop exclusive
animate self "walk" reverse
animate Button "hover" duration 200 loop`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, #tag, or all type" },
      { name: "group", type: "string", description: "State group name (in quotes)" },
      { name: "fps", type: "number", description: "Frames per second \u2014 frame mode (overrides group default)", optional: true },
      { name: "duration", type: "number", description: "Milliseconds per transition step \u2014 tween mode (overrides group default)", optional: true },
      { name: "easing", type: "string", description: "Easing function: linear, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic", optional: true },
      { name: "loop|once|pingpong", type: "keyword", description: "Play mode (default: loop)", optional: true },
      { name: "cw|ccw", type: "keyword", description: "Force rotation direction: cw (clockwise) or ccw (counter-clockwise). Default: shortest path.", optional: true },
      { name: "resume", type: "keyword", description: "Tween from current visual state to first frame instead of snapping. Smooth transition into the animation.", optional: true },
      { name: "exclusive", type: "keyword", description: "Stop all other group animations on this object before starting. Use for directional sprites where only one animation should play at a time.", optional: true },
      { name: "reverse", type: "keyword", description: "Reverse the state order at play time. A group with states A\u2192B\u2192C plays as C\u2192B\u2192A.", optional: true }
    ],
    notes: "By default, multiple group animations can run concurrently on the same object. Use `exclusive` to stop all other group animations before starting. Manual `set state` also stops running animation. Frame mode uses fps; tween mode uses duration + easing. cw/ccw only affects tween mode rotation interpolation."
  },
  "stop animate": {
    description: "Stop state group animation",
    longDescription: "Stops a running state group animation on the target object. The object stays at its current visual state.",
    example: `stop animate self
stop animate Button
stop animate #enemies`,
    parameters: [
      { name: "target", type: "string", description: "Object name, self, #tag, or all type" }
    ],
    notes: "Object retains its current appearance. Different from `stop` which stops procedural animations (shake, pulse, etc.)."
  },
  reveal: {
    description: "Reveal area on mask",
    longDescription: "Makes a circular area of a mask transparent, revealing objects underneath. Coordinates are relative to the mask's top-left corner, using the same scale as the mask's width/height. Use to create fog-of-war effects, digging mechanics, or destructible terrain.",
    example: `reveal Mask1 0.2 0.2
reveal Mask1 0.5 0.5 0.1
reveal Mask1 self.x self.y 0.05 0.02`,
    parameters: [
      { name: "target", type: "string", description: "Mask object name" },
      { name: "x", type: "expression", description: "X position relative to mask (0 = left edge)" },
      { name: "y", type: "expression", description: "Y position relative to mask (0 = top edge)" },
      { name: "radius", type: "expression", description: "Reveal radius in mask-relative units (optional, uses mask default)", optional: true },
      { name: "fade", type: "expression", description: "Edge fade width in mask-relative units (optional, uses mask default)", optional: true }
    ],
    notes: "Coordinates use the mask's coordinate system (0,0 = top-left of mask, maskWidth,maskHeight = bottom-right). Radius and fade are in the same units."
  },
  rehide: {
    description: "Rehide (restore fog) on a mask",
    longDescription: "Resets a mask or specific revealer layer back to fully opaque (hidden). Without a revealer name, resets the entire mask. With a revealer name, resets only that revealer's trail.",
    example: `rehide Mask1
rehide Mask1 Player`,
    parameters: [
      { name: "target", type: "string", description: "Mask object name" },
      { name: "revealer", type: "string", description: "Revealer object name (optional, resets all if omitted)", optional: true }
    ]
  }
};
var TRANSITIONS = {
  fade: {
    description: "Fade in/out",
    validFor: ["goto", "show", "hide", "destroy"]
  },
  scale: {
    description: "Scale up/down",
    validFor: ["show", "hide", "destroy"]
  },
  "slide-up": {
    description: "Slide upward",
    validFor: ["goto", "show", "hide", "destroy"]
  },
  "slide-down": {
    description: "Slide downward",
    validFor: ["goto", "show", "hide", "destroy"]
  },
  "slide-left": {
    description: "Slide left",
    validFor: ["goto"]
  },
  "slide-right": {
    description: "Slide right",
    validFor: ["goto"]
  },
  zoom: {
    description: "Zoom in/out",
    validFor: ["goto"]
  }
};
var FUNCTIONS = {
  visited: {
    description: "Cell has been visited",
    longDescription: 'Returns true if the specified cell has been visited at least once. Use "this" for the current cell.',
    example: 'if visited("SecretRoom"):',
    parameters: [
      { name: "cell", type: "string", description: 'Cell name or "this"' }
    ],
    returns: "boolean"
  },
  hasSave: {
    description: "Check if save slot exists",
    longDescription: 'Returns true if a named save slot exists. Use to conditionally show a "Continue" button or check before loading.',
    example: 'if hasSave("checkpoint"):',
    parameters: [
      { name: "slotName", type: "string", description: "Name of the save slot to check" }
    ],
    returns: "boolean"
  },
  visits: {
    description: "Visit count",
    longDescription: "Returns the number of times a cell has been visited. Useful for showing different content on repeat visits.",
    example: 'if visits("this") > 1:',
    parameters: [
      { name: "cell", type: "string", description: 'Cell name or "this"' }
    ],
    returns: "number"
  },
  hasObject: {
    description: "Cell has object",
    longDescription: "Returns true if the current cell contains an object with the specified name.",
    example: 'if hasObject("Key"):',
    parameters: [
      { name: "name", type: "string", description: "Object name to check for" }
    ],
    returns: "boolean"
  },
  get: {
    description: "Get variable value",
    longDescription: "Returns the value of a stored variable. Useful when the variable name is dynamic or stored in another variable.",
    example: 'if get("score") > 100:',
    parameters: [
      { name: "key", type: "string", description: "Variable name" }
    ],
    returns: "any"
  },
  random: {
    description: "Random number",
    longDescription: "random() returns 0-1 float. random(min, max) returns random integer from min to max (inclusive).",
    example: "set roll random(1, 6)",
    parameters: [
      { name: "min", type: "number", description: "Minimum value (inclusive)", optional: true },
      { name: "max", type: "number", description: "Maximum value (inclusive)", optional: true }
    ],
    returns: "number"
  },
  floor: {
    description: "Round down",
    longDescription: "Returns the largest integer less than or equal to the given number.",
    example: "set whole floor(3.7)  // 3",
    parameters: [
      { name: "value", type: "number", description: "Number to round down" }
    ],
    returns: "number"
  },
  ceil: {
    description: "Round up",
    longDescription: "Returns the smallest integer greater than or equal to the given number.",
    example: "set whole ceil(3.2)  // 4",
    parameters: [
      { name: "value", type: "number", description: "Number to round up" }
    ],
    returns: "number"
  },
  round: {
    description: "Round to nearest",
    longDescription: "Returns the value rounded to the nearest integer.",
    example: "set whole round(3.5)  // 4",
    parameters: [
      { name: "value", type: "number", description: "Number to round" }
    ],
    returns: "number"
  },
  abs: {
    description: "Absolute value",
    longDescription: "Returns the absolute (non-negative) value of a number.",
    example: "set dist abs(x - targetX)",
    parameters: [
      { name: "value", type: "number", description: "Number to get absolute value of" }
    ],
    returns: "number"
  },
  min: {
    description: "Minimum value",
    longDescription: "Returns the smallest of the given numbers.",
    example: "set lowest min(a, b, c)",
    parameters: [
      { name: "values", type: "number...", description: "Numbers to compare" }
    ],
    returns: "number"
  },
  max: {
    description: "Maximum value",
    longDescription: "Returns the largest of the given numbers.",
    example: "set highest max(a, b, c)",
    parameters: [
      { name: "values", type: "number...", description: "Numbers to compare" }
    ],
    returns: "number"
  },
  sin: {
    description: "Sine (degrees)",
    longDescription: "Returns the sine of an angle in degrees. Useful for converting rotation to directional velocity.",
    example: "set vx cos(self.rotation) * speed\nset vy sin(self.rotation) * speed",
    parameters: [
      { name: "degrees", type: "number", description: "Angle in degrees" }
    ],
    returns: "number"
  },
  cos: {
    description: "Cosine (degrees)",
    longDescription: "Returns the cosine of an angle in degrees. Useful for converting rotation to directional velocity.",
    example: "set vx cos(self.rotation) * speed",
    parameters: [
      { name: "degrees", type: "number", description: "Angle in degrees" }
    ],
    returns: "number"
  },
  atan2: {
    description: "Angle from coordinates",
    longDescription: "Returns the angle in degrees from the positive X axis to the point (x, y). Useful for calculating the angle between two objects.",
    example: "set angle atan2(target.y - self.y, target.x - self.x)",
    parameters: [
      { name: "y", type: "number", description: "Y component" },
      { name: "x", type: "number", description: "X component" }
    ],
    returns: "number"
  },
  cardinal: {
    description: "Angle to cardinal direction",
    longDescription: 'Converts an angle (in degrees) to a cardinal direction string: "right" (0\xB0), "down" (90\xB0), "left" (180\xB0), "up" (270\xB0). Useful for setting object states based on movement angle.',
    example: "set self.state cardinal(moveAngle)",
    parameters: [
      { name: "angle", type: "number", description: "Angle in degrees (0=right, 90=down, 180=left, 270=up)" }
    ],
    returns: "string"
  },
  length: {
    description: "Array/string length",
    longDescription: "Returns the number of elements in an array or characters in a string.",
    example: "if length(items) > 0:",
    parameters: [
      { name: "value", type: "array|string", description: "Array or string to measure" }
    ],
    returns: "number"
  },
  range: {
    description: "Generate number sequence",
    longDescription: "range(n) returns [0..n-1]. range(min, max) returns [min..max] (inclusive).",
    example: "foreach i in range(0, 5):",
    parameters: [
      { name: "min_or_count", type: "number", description: "Count (1 arg) or start value (2 args)" },
      { name: "max", type: "number", description: "End value (inclusive)", optional: true }
    ],
    returns: "array"
  },
  shuffle: {
    description: "Randomize array",
    longDescription: "Returns a new array with the elements in random order.",
    example: "set deck shuffle(cards)",
    parameters: [
      { name: "array", type: "array", description: "Array to shuffle" }
    ],
    returns: "array"
  },
  pick: {
    description: "Random element",
    longDescription: "Returns a random element from the array.",
    example: "set winner pick(players)",
    parameters: [
      { name: "array", type: "array", description: "Array to pick from" }
    ],
    returns: "any"
  },
  isEmpty: {
    description: "Check grid cell empty",
    longDescription: "Returns true if the specified grid cell has no movable objects.",
    example: 'if isEmpty("Grid1", 2, 3):',
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "x", type: "number", description: "Column (0-indexed)" },
      { name: "y", type: "number", description: "Row (0-indexed)" }
    ],
    returns: "boolean"
  },
  emptyCells: {
    description: "Get empty grid cells",
    longDescription: "Returns an array of {x, y} objects for all empty cells in the grid. Checks for objects with cellX/cellY properties.",
    example: 'set available emptyCells("Grid1")',
    parameters: [
      { name: "grid", type: "string", description: "Grid name" }
    ],
    returns: "array"
  },
  cellsWhere: {
    description: "Find grid cells by data",
    longDescription: "Returns an array of {x, y} objects for all cells in the grid where the stored data matches the condition. Uses grid cell data storage, not object positions.",
    example: `// Find cells marked as "red"
set redCells cellsWhere("Board", "color", "==", "red")

// Find cells owned by player 1
set p1Cells cellsWhere("Board", "owner", "==", 1)`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "property", type: "string", description: "Cell data property to check" },
      { name: "operator", type: "string", description: "Comparison: ==, !=, >, <, >=, <=" },
      { name: "value", type: "any", description: "Value to compare against" }
    ],
    returns: "array",
    notes: "Works with grid cell data set via set Grid.cell[x][y].property syntax."
  },
  floodfill: {
    description: "Find connected grid cells",
    longDescription: "Returns all cells connected to the starting cell through cells matching the criteria. Supports 4-way (cardinal only) or 8-way (cardinal + diagonal) adjacency. Useful for connectivity checking, match-3 games, territory control, and determining if removing a piece would create islands.",
    example: `// Find all cells connected through occupied cells (8-way default)
set connected floodfill("GRID", 4, 4, "occupied", true)

// 4-way connectivity (cardinal directions only)
set connected floodfill("GRID", 4, 4, "occupied", true, 4)

// Match-3: find connected same-color cells
set cluster floodfill("Board", clickX, clickY, "color", "red")
if length(cluster) >= 3:
  // Clear the cluster`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "startX", type: "number", description: "Starting column (0-indexed)" },
      { name: "startY", type: "number", description: "Starting row (0-indexed)" },
      { name: "property", type: "string", description: 'Cell data property to match (default: "occupied")', optional: true },
      { name: "value", type: "any", description: "Value to match (default: true)", optional: true },
      { name: "connectivity", type: "number", description: "4 (cardinal) or 8 (cardinal + diagonal, default)", optional: true }
    ],
    returns: "array",
    notes: "Returns array of {x, y} objects. Uses grid cell data, not object positions. Empty array if start cell doesn't match."
  },
  minimax: {
    description: "AI best move (minimax)",
    longDescription: "Uses minimax algorithm with alpha-beta pruning to find the optimal move for grid-based games like Connect4, Tic-tac-toe, etc. Returns the best column index for the AI player.",
    example: `// Connect4 AI move
set bestCol minimax("Board", "owner", "YELLOW", "RED", 4)
set col bestCol
Start.dropPiece

// Tic-tac-toe (3x3, win=3)
set bestCol minimax("Grid", "mark", "O", "X", 6, 0, 3)`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "property", type: "string", description: "Cell data property for ownership" },
      { name: "aiPlayer", type: "any", description: 'AI player value (e.g., "YELLOW")' },
      { name: "humanPlayer", type: "any", description: 'Human player value (e.g., "RED")' },
      { name: "depth", type: "number", description: "Search depth (4-6 recommended)" },
      { name: "emptyValue", type: "any", description: "Empty cell value (default: 0)", optional: true },
      { name: "winLength", type: "number", description: "Pieces to win (default: 4)", optional: true }
    ],
    returns: "number",
    notes: "Higher depth = stronger but slower. Depth 4-5 is good for Connect4. Returns -1 if no valid move."
  },
  hash: {
    description: "Hash values to integer",
    longDescription: "Computes a hash value from one or more inputs. Use #tag.property to hash arrays of values from tagged objects. Useful for deterministic pseudo-random seeds.",
    example: `// Hash ball positions
set seed hash(#balls.x, #balls.y)

// Hash single values
set id hash(x, y, z)

// Hash any properties
set seed hash(#pieces.cellX, #pieces.cellY)`,
    parameters: [
      { name: "values", type: "any...", description: "Values to hash: numbers, strings, arrays (from #tag.property)" }
    ],
    returns: "number",
    notes: "Arrays are hashed element by element."
  },
  // Spatial query functions
  distance: {
    description: "Distance between objects",
    longDescription: "Returns the Euclidean distance between two objects in normalized coordinates (0\u20131). Works with self, other, object names, and UUIDs.",
    example: `if distance(self, Enemy) < 0.2:
  impulse self 0 -0.5`,
    parameters: [
      { name: "objectA", type: "object", description: "First object (self, other, or name)" },
      { name: "objectB", type: "object", description: "Second object (self, other, or name)" }
    ],
    returns: "number"
  },
  nearby: {
    description: "Objects within radius",
    longDescription: "Returns all objects within the given radius of the reference object, sorted by distance. Optional tag filter. Each result has name, x, y, and distance properties.",
    example: `set enemies nearby(self, 0.2, #enemy)
if length(enemies) > 0:
  set closest enemies[0]`,
    parameters: [
      { name: "object", type: "object", description: "Center object (self, other, or name)" },
      { name: "radius", type: "number", description: "Search radius (normalized coords)" },
      { name: "tag", type: "tag", description: "Optional tag filter (#tag)", optional: true }
    ],
    returns: "array",
    notes: "Returns array of {name, x, y, distance}. Excludes the reference object."
  },
  nearest: {
    description: "Closest matching object",
    longDescription: "Returns the Nth closest object to a reference point, optionally filtered by tag, name, or sibling. Can measure from an object or from x/y coordinates. Returns {name, x, y, distance} or 0 if no match.",
    example: `set target nearest(self, #coin)
if target != 0:
  set dx target.x - self.x

// Check spawn position is clear
set sx random
set sy random
if nearest(sx, sy, #enemy).distance > 0.1:
  spawn "Enemy" {x: sx, y: sy}

// 2nd nearest enemy
set second nearest(self, #enemy, 2)`,
    parameters: [
      { name: "ref", type: "object|number", description: "Reference object (self, other, name) or X coordinate" },
      { name: "y/selector", type: "number|string", description: 'Y coordinate (if ref is X) or selector (#tag, name, "sibling")' },
      { name: "selector/rank", type: "string|number", description: "Selector (if using x/y) or rank (default 1)", optional: true },
      { name: "rank", type: "number", description: "Nth nearest (default 1, only when using x/y)", optional: true }
    ],
    returns: "object|0",
    notes: 'Returns {name, x, y, distance} or 0. Use "sibling" selector for same-component children. Rank 2 = second nearest, etc.'
  },
  intersects: {
    description: "Collision shape overlap",
    longDescription: "Tests if two objects' collision shapes overlap using SAT (Separating Axis Theorem). Supports tag matching to test against multiple objects.",
    example: `if intersects(Sword, Enemy):
  destroy Enemy
if intersects(self, #coin):
  set score score + 1`,
    parameters: [
      { name: "objectA", type: "object", description: "First object (self, other, or name)" },
      { name: "objectB", type: "object|tag", description: "Second object or #tag (returns true if any tagged object intersects)" }
    ],
    returns: "boolean",
    notes: "Objects must have collision shapes (be in the dynamics engine). Returns false if shapes missing."
  },
  canSee: {
    description: "Line of sight on grid",
    longDescription: "Checks if there is a clear line of sight between two grid cells. Uses Bresenham line algorithm. Cells with the blocker property set to a truthy value block sight.",
    example: `if canSee("Grid", self.cellX, self.cellY, Player.cellX, Player.cellY, "wall"):
  shout "SPOTTED"`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "x1", type: "number", description: "Start column" },
      { name: "y1", type: "number", description: "Start row" },
      { name: "x2", type: "number", description: "End column" },
      { name: "y2", type: "number", description: "End row" },
      { name: "blockerProp", type: "string", description: 'Cell data property that blocks sight (default: "wall")', optional: true }
    ],
    returns: "boolean",
    notes: "Uses grid cell data. Set wall cells: set Grid.cell[x][y].wall true"
  },
  pathfind: {
    description: "A* pathfinding on grid",
    longDescription: "Finds the shortest path between two grid cells using A* algorithm. Returns array of {x, y} waypoints (excluding start, including goal). Empty array if no path exists.",
    example: `set path pathfind("Grid", self.cellX, self.cellY, Goal.cellX, Goal.cellY, "wall")
if length(path) > 0:
  set nextStep path[0]`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "x1", type: "number", description: "Start column" },
      { name: "y1", type: "number", description: "Start row" },
      { name: "x2", type: "number", description: "End column" },
      { name: "y2", type: "number", description: "End row" },
      { name: "blockerProp", type: "string", description: 'Cell data property that blocks movement (default: "wall")', optional: true }
    ],
    returns: "array",
    notes: "Cardinal movement only (4-way). Uses grid cell data for obstacles."
  },
  generateMaze: {
    description: "Generate maze on grid",
    longDescription: "Generates a random maze on a grid using recursive backtracker algorithm. Sets cell data to mark walls and passages. Works best with odd-dimension grids (walls on even coords, passages on odd).",
    example: `generateMaze("Grid", "wall")
// Grid.cell[x][y].wall is now true for walls, false for passages`,
    parameters: [
      { name: "grid", type: "string", description: "Grid name" },
      { name: "wallProp", type: "string", description: 'Cell data property for walls (default: "wall")', optional: true }
    ],
    returns: "number",
    notes: "Returns count of passage cells. Uses grid cell data storage."
  }
};
var VARIABLES = {
  random: {
    description: "Random 0-1 value",
    longDescription: "Returns a fresh random number between 0 and 1 each time it's accessed. Useful for probability-based events.",
    example: "if random < 0.5:",
    type: "number"
  },
  currentCell: {
    description: "Current cell name",
    longDescription: "Returns the label/name of the current cell. Useful for conditional logic based on location.",
    example: 'if currentCell == "Start":',
    type: "string"
  },
  clicks: {
    description: "Click count",
    longDescription: "Returns how many times the current element has been clicked in this session. Useful for tracking progress through sequential content.",
    example: "if clicks == 3:",
    type: "number"
  },
  clickX: {
    description: "Pointer X in world units",
    longDescription: "Returns the X coordinate (in world units) of the pointer when the current event was triggered. Available in onClick, onDragStart, onDrag, onDragEnd, onHover, and onHoverEnd handlers. Returns 0 if no pointer position is available.",
    example: "set marker.x clickX",
    type: "number"
  },
  clickY: {
    description: "Pointer Y in world units",
    longDescription: "Returns the Y coordinate (in world units) of the pointer when the current event was triggered. Available in onClick, onDragStart, onDrag, onDragEnd, onHover, and onHoverEnd handlers. Returns 0 if no pointer position is available.",
    example: "set marker.y clickY",
    type: "number"
  },
  deltaTime: {
    description: "Frame time in seconds",
    longDescription: "Time elapsed since the last physics frame, in seconds. Available in onTick handlers. Use for frame-rate independent calculations: multiply speeds and rates by deltaTime.",
    example: "set self.rotation self.rotation + 180 * deltaTime",
    type: "number"
  },
  other: {
    description: "Other object in collision/overlap",
    longDescription: "References the other object involved in a collision or overlap event. Available in onCollide, onOverlap, and onOverlapEnd handlers. Access properties with other.property (e.g., other.name, other.x, other.visible). Can also read custom object variables with other.varName. Use with hasTag to check tags: `if other hasTag #enemy`.",
    example: "if other hasTag #missile:\n  set health health - 1",
    type: "object"
  },
  newGame: {
    description: "True on fresh start, false on save restore",
    longDescription: "Boolean that is true when the game starts normally and false when restoring from a saved game. Use in onEnter to skip initialization that should only happen on fresh starts (e.g., spawning objects, setting initial positions). Prevents duplicate objects or reset state when loading a save.",
    example: 'onEnter:\n  if newGame:\n    spawn "Enemy" {x: 0.5, y: 0.5}',
    type: "boolean"
  },
  self: {
    description: "Reference to current object",
    longDescription: 'References the object running the script. Use self.property to read/write built-in properties (x, y, rotation, visible, etc.) or custom object variables. Custom variables: `set self.health 100` stores a per-instance variable called "health" on this object. Any property name not in the built-in list becomes an object variable. For components, access children with self.ChildName.property (e.g., self.Turret.rotation).',
    example: "set self.health 100\nif self.health <= 0:\n  destroy self",
    type: "object"
  }
};
var CONCEPTS = {
  objectVariables: {
    description: "Custom per-instance variables on objects",
    longDescription: "Any property name that isn't a built-in scriptable property becomes a custom object variable stored per instance. Use `set self.health 100` to create/update and `self.health` to read. These survive across events within a session. Other objects can read them too: `set score Enemy.health`. In collision/overlap handlers, use `other.varName` to read the other object's custom variables.",
    example: `set self.health 100
set self.ammo 30
if self.health <= 0:
  destroy self

// Reading from another object
set display.content Enemy.health

// In onCollide handler
onCollide:
  if other hasTag #bullet:
    set self.health self.health - other.damage`,
    notes: "Object variables are session-scoped (cleared on reset). They are distinct from session/game/local variables which are global."
  },
  componentChildAccess: {
    description: "Access component children from parent script",
    longDescription: "In a component's script, access child objects using `self.ChildName.property` paths. This lets parent scripts control children (e.g., a Tank component rotating its Turret child). Works for both reading and writing properties and custom variables on children.",
    example: `// In Tank component script:
set self.Turret.rotation aimAngle
set self.Barrel.visible true
if self.Turret.ammo <= 0:
  set self.Turret.state "empty"`,
    notes: "Child names are the object names within the component. Only works from the parent component's own script."
  },
  messageParameters: {
    description: "Passing data through shout messages",
    longDescription: 'The `shout` command can include parameters as key-value pairs: `shout "MSG" {key: value}`. In the receiving `onMessage` handler, these parameters are available as local variables. This is the primary way to pass data between objects.',
    example: `// Sender:
shout "DAMAGE" {amount: 25, type: "fire"}

// Receiver:
onMessage "DAMAGE":
  set self.health self.health - amount
  if type == "fire":
    set self.state "burning"`,
    notes: "Parameters are only available inside the onMessage handler that receives them. They do not persist after the handler runs."
  },
  spawnParameters: {
    description: "Passing data to spawned objects",
    longDescription: 'The `spawn` command can include parameters: `spawn "Name" {key: value}`. In the spawned object\'s `onSpawn` handler, these parameters are available as local variables. Special parameters: `x` and `y` set the spawn position directly.',
    example: `// Spawner:
spawn "Bullet" {x: self.x, y: self.y, dir: self.rotation, speed: 5, damage: 10}

// Spawned object's onSpawn handler:
onSpawn:
  set self.rotation dir
  set self.damage damage
  enable self movable speed speed axis forward facing`,
    notes: "Spawn params are local to onSpawn. Store them as object variables (set self.varName param) to use in other handlers."
  },
  variableScopes: {
    description: "Session, game, and local variable scopes",
    longDescription: "Variables have three scopes: session (default, cleared on reset), game (persists across resets but not page reload), and local (persists in browser localStorage forever). Use prefix to choose scope: `set score 10` (session), `set game.score 10` (game), `set local.highscore 100` (local). All scopes are global \u2014 accessible from any object or cell.",
    example: `set score 10          // session scope \u2014 cleared on reset/restart
set game.lives 3      // game scope \u2014 survives reset, lost on page reload
set local.bestTime 42 // local scope \u2014 persists in localStorage forever`,
    notes: "Object variables (self.x) are different from scoped variables (score, game.x, local.x). Object variables are per-instance; scoped variables are global."
  }
};
var OPERATORS2 = {
  if: {
    description: "Conditional block",
    example: "if score > 10:",
    category: "control"
  },
  else: {
    description: "Alternative block",
    example: "else:",
    category: "control"
  },
  and: {
    description: "Both must be true",
    example: "if hasKey and doorOpen:",
    category: "logical"
  },
  or: {
    description: "Either can be true",
    example: "if hasKey or hasCard:",
    category: "logical"
  },
  not: {
    description: "Negate condition",
    example: 'if not visited("Room"):',
    category: "logical"
  },
  "==": {
    description: "Equal to",
    example: "if score == 100:",
    category: "comparison"
  },
  "!=": {
    description: "Not equal to",
    example: 'if state != "done":',
    category: "comparison"
  },
  ">": {
    description: "Greater than",
    example: "if score > 50:",
    category: "comparison"
  },
  "<": {
    description: "Less than",
    example: "if health < 20:",
    category: "comparison"
  },
  ">=": {
    description: "Greater or equal",
    example: "if level >= 5:",
    category: "comparison"
  },
  "<=": {
    description: "Less or equal",
    example: "if tries <= 3:",
    category: "comparison"
  }
};
var SCRIPTABLE_PROPERTIES = {
  // Object properties
  x: { description: "Horizontal position", type: "number", example: "set Box.x 0.5" },
  y: { description: "Vertical position", type: "number", example: "set Box.y 0.25" },
  width: { description: "Width", type: "number", example: "set Box.width 0.3" },
  height: { description: "Height", type: "number", example: "set Box.height 0.2" },
  lineX1: { description: "Line start X", type: "number", example: "set self.lineX1 0.1" },
  lineY1: { description: "Line start Y", type: "number", example: "set self.lineY1 0.2" },
  lineX2: { description: "Line end X", type: "number", example: "set self.lineX2 0.9" },
  lineY2: { description: "Line end Y", type: "number", example: "set self.lineY2 0.8" },
  lineStartMarker: { description: "Line start marker: none, arrow, circle, square, diamond", type: "string", example: 'set self.lineStartMarker "arrow"' },
  lineEndMarker: { description: "Line end marker: none, arrow, circle, square, diamond", type: "string", example: 'set self.lineEndMarker "arrow"' },
  lineCap: { description: "Line cap style: butt, round, square", type: "string", example: 'set self.lineCap "round"' },
  visible: { description: "Visibility", type: "boolean", example: "set Box.visible false" },
  opacity: { description: "Opacity (0-1)", type: "number", example: "set Box.opacity 0.5" },
  blendMode: { description: "Blend mode (normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn)", type: "string", example: 'set Shadow.blendMode "multiply"' },
  strokeColor: { description: "Border color", type: "color", example: 'set Box.strokeColor "#000"' },
  strokeWidth: { description: "Border width", type: "number", example: "set Box.strokeWidth 2" },
  content: { description: "Text content", type: "string", example: 'set Text1.content "Hello"' },
  textColor: { description: "Text color", type: "color", example: 'set Text1.textColor "#fff"' },
  fontSize: { description: "Font size (textbox: fixed size, text: unused)", type: "number", example: "set TextBox1.fontSize 2" },
  editable: { description: "Allow typing at runtime (text only)", type: "boolean", example: "set Text1.editable true" },
  lineHeight: { description: "Line spacing multiplier (textbox only, default 1.3)", type: "number", example: "set TextBox1.lineHeight 1.5" },
  verticalAlign: { description: "Vertical text alignment (textbox only)", type: "string", example: 'set TextBox1.verticalAlign "center"', notes: '"top", "center", "bottom"' },
  cornerRadius: { description: "Corner radius", type: "number", example: "set Box.cornerRadius 10" },
  shadowX: { description: "Shadow X offset", type: "number", example: "set Box.shadowX 4" },
  shadowY: { description: "Shadow Y offset", type: "number", example: "set Box.shadowY 4" },
  shadowBlur: { description: "Shadow blur", type: "number", example: "set Box.shadowBlur 8" },
  shadowColor: { description: "Shadow color", type: "color", example: 'set Box.shadowColor "rgba(0,0,0,0.5)"' },
  glowBlur: { description: "Glow spread radius", type: "number", example: "set Box.glowBlur 10" },
  glowColor: { description: "Glow color", type: "color", example: 'set Box.glowColor "#ff0000"' },
  glowIntensity: { description: "Glow intensity (1-10, higher = more solid)", type: "number", example: "set Box.glowIntensity 5" },
  trail: { description: "Enable motion trail", type: "boolean", example: "set Player.trail true" },
  trailLength: { description: "Trail length in frames (default 20)", type: "number", example: "set Player.trailLength 30" },
  trailOpacity: { description: "Trail starting opacity (default 0.3)", type: "number", example: "set Player.trailOpacity 0.5" },
  trailColor: { description: "Trail color (default: object fill)", type: "color", example: 'set Player.trailColor "#00ffff"' },
  trailScale: { description: "Trail point scale (default 0.8)", type: "number", example: "set Player.trailScale 0.6" },
  trailSpacing: { description: "Min distance between trail points (default 0)", type: "number", example: "set Player.trailSpacing 0.02" },
  zIndex: { description: "Layer order", type: "number", example: "set Box.zIndex 10" },
  rotation: { description: "Rotation angle (0-360)", type: "number", example: "set Box.rotation 45" },
  flipX: { description: "Horizontal flip", type: "boolean", example: "set Box.flipX true" },
  flipY: { description: "Vertical flip", type: "boolean", example: "set Box.flipY true" },
  state: { description: "Component state", type: "string", example: 'set Button.state "hover"' },
  // Physics properties
  rotatable: { description: "Enable angular physics (tipping, torque)", type: "boolean", example: "set Box.rotatable true" },
  // Dynamics properties (read-only)
  cellX: { description: "Grid column position", type: "number", example: "if Player.cellX == 3:", readonly: true },
  cellY: { description: "Grid row position", type: "number", example: "if Player.cellY == 2:", readonly: true },
  moving: { description: "Is object moving", type: "boolean", example: "if Player.moving:", readonly: true },
  direction: { description: "Movement direction", type: "string", example: 'if Player.direction == "down":', readonly: true, notes: '"up", "down", "left", "right", "none"' },
  velocityX: { description: "Horizontal velocity", type: "number", example: "if Player.velocityX > 0:", readonly: true },
  velocityY: { description: "Vertical velocity", type: "number", example: "if Player.velocityY > 0:", readonly: true },
  angularVelocity: { description: "Rotation speed (deg/sec)", type: "number", example: "if Box.angularVelocity > 10:", readonly: true, notes: "Only available on rotatable objects" },
  moveAngle: { description: "Movement angle (degrees)", type: "number", example: "set self.rotation moveAngle", readonly: true, notes: "0=right, 90=down, 180=left, 270=up, -1=not moving" },
  moveSpeed: { description: "Movement speed magnitude", type: "number", example: "if Player.moveSpeed > 0.5:", readonly: true },
  spriteFrame: { description: "Current sprite sheet frame (0-based)", type: "number", example: "set self.spriteFrame 3", notes: "Only affects objects with sprite sheet image fills (spriteColumns/spriteRows > 1)" },
  tags: { description: "Object tags (array of strings)", type: "array", example: 'set self.tags ["tile", "clickable"]' },
  perspectiveX: { description: "Perspective vanishing point X (0-2)", type: "number", example: "set Box.perspectiveX 0.5" },
  perspectiveY: { description: "Perspective vanishing point Y (0-2)", type: "number", example: "set Box.perspectiveY 0.5" },
  gravityScale: { description: "Gravity multiplier (0=weightless, 1=normal, 2=heavy)", type: "number", example: "set self.gravityScale 0.5" },
  windScale: { description: "Wind multiplier (0=immune, 1=normal, 2=extra)", type: "number", example: "set self.windScale 2" },
  dragScale: { description: "Air resistance multiplier (0=no drag, 1=normal, 2=heavy drag)", type: "number", example: "set self.dragScale 0.5" },
  timeScale: { description: "Per-object time scale override (0=frozen, 0.5=half speed, 1=normal, 2=double). Overrides Cell.timeScale for this object", type: "number", example: "set self.timeScale 0" },
  // Revealer properties
  revealer: { description: "Auto-reveal overlapping masks as object moves", type: "boolean", example: "set Player.revealer true" },
  revealerRadius: { description: "Reveal radius override (mask-relative units)", type: "number", example: "set Player.revealerRadius 0.08" },
  revealerFade: { description: "Reveal fade override (mask-relative units)", type: "number", example: "set Player.revealerFade 0.03" },
  revealerNoise: { description: "Reveal noise override (0=smooth, 1=max)", type: "number", example: "set Player.revealerNoise 0.4" },
  revealerShape: { description: "Reveal shape: circle or rect", type: "string", example: "set Player.revealerShape rect" },
  revealerRehide: { description: "Enable auto-rehide (fog returns when revealer moves away)", type: "boolean", example: "set Player.revealerRehide true" },
  revealerRehideSpeed: { description: "Rehide speed (0=instant, higher=slower)", type: "number", example: "set Player.revealerRehideSpeed 2" },
  revealerRehideGrowth: { description: "Rehide growth factor", type: "number", example: "set Player.revealerRehideGrowth 1" },
  revealerRehideRate: { description: "Rehide speed multiplier (1=normal, 2=twice as fast)", type: "number", example: "set Player.revealerRehideRate 2" },
  revealerRehideStopThreshold: { description: "Pause rehide when stopped briefly (seconds, 0=disabled)", type: "number", example: "set Player.revealerRehideStopThreshold 0.5" },
  // Peg constraint properties (when primeType === 'peg')
  pegType: { description: "Constraint type: pin or weld", type: "string", example: 'set Peg1.pegType "weld"' },
  pegDamping: { description: "Swing friction (0 = swings forever, 1 = stops quickly)", type: "number", example: "set Peg1.pegDamping 0.5" },
  pegBreakForce: { description: "Force threshold to break the connection", type: "number", example: "set Peg1.pegBreakForce 100" },
  // Spring properties (when primeType === 'spring')
  springStiffness: { description: "Spring stiffness (0 = rigid rod, higher = more elastic)", type: "number", example: "set Spring1.springStiffness 30" },
  springDamping: { description: "Spring energy dissipation", type: "number", example: "set Spring1.springDamping 2" },
  springBreakForce: { description: "Force threshold to break the spring", type: "number", example: "set Spring1.springBreakForce 100" },
  // Audio segment properties
  startMarker: { description: "Audio start position in seconds", type: "number", example: "set Music.startMarker 5" },
  duration: { description: "Audio playback duration in seconds from start marker (0 = play to end)", type: "number", example: "set Music.duration 10" },
  // Audio playback mode
  buffered: { description: "Independent playback per instance via AudioBuffer (default: true for SFX audioType)", type: "boolean", example: "set Gunshot.buffered true" },
  // Spatial audio
  spatial: { description: "Distance-based volume attenuation from camera subject", type: "boolean", example: "set EngineSound.spatial true" },
  spatialRange: { description: "Distance (0-1 canvas units) at which spatial volume reaches 0 (default 1.0)", type: "number", example: "set EngineSound.spatialRange 0.5" },
  // Emitter
  emitterShape: { description: "Emitter shape: circle (outward from center) or rectangle (inward from top edge)", type: "string", example: 'set MyEmitter.emitterShape "circle"' },
  emitterSizeMode: { description: 'Size mode: "contain" = particles die at shape boundary, "area" = spawn within shape', type: "string", example: 'set MyEmitter.emitterSizeMode "contain"' },
  emitterRate: { description: "Particles emitted per second (default 10)", type: "number", example: "set MyEmitter.emitterRate 20" },
  emitterBurst: { description: "One-shot burst: set to N to emit N particles immediately (auto-resets to 0)", type: "number", example: "set MyEmitter.emitterBurst 30" },
  particleLifetime: { description: "Particle lifetime in ms (default 1000)", type: "number", example: "set MyEmitter.particleLifetime 2000" },
  particleSpeedMin: { description: "Min particle speed in canvas-units/sec (default 0.1)", type: "number", example: "set MyEmitter.particleSpeedMin 0.05" },
  particleSpeedMax: { description: "Max particle speed in canvas-units/sec (default 0.3)", type: "number", example: "set MyEmitter.particleSpeedMax 0.5" },
  particleSpread: { description: "Angle divergence in degrees from base direction (default 30)", type: "number", example: "set MyEmitter.particleSpread 45" },
  particleShape: { description: "Particle shape: circle, square, or line (default circle)", type: "string", example: 'set MyEmitter.particleShape "line"' },
  particleTrailLength: { description: "Number of past positions for trail effect (0=off, default 0)", type: "number", example: "set MyEmitter.particleTrailLength 5" },
  particleSizeStart: { description: "Particle starting size in px (default 6)", type: "number", example: "set MyEmitter.particleSizeStart 10" },
  particleSizeEnd: { description: "Particle ending size in px (default 2)", type: "number", example: "set MyEmitter.particleSizeEnd 0" },
  particleOpacityStart: { description: "Particle starting opacity 0-1 (default 1)", type: "number", example: "set MyEmitter.particleOpacityStart 0.8" },
  particleOpacityEnd: { description: "Particle ending opacity 0-1 (default 0)", type: "number", example: "set MyEmitter.particleOpacityEnd 0" },
  particleColorA: { description: "Spawn color range start \u2014 each particle gets random color between A and B (default #ffffff)", type: "color", example: 'set MyEmitter.particleColorA "#ff4400"' },
  particleColorB: { description: "Spawn color range end (default #ffffff)", type: "color", example: 'set MyEmitter.particleColorB "#ffaa00"' },
  particleColorEnd: { description: "Optional color particles fade to over lifetime", type: "color", example: 'set MyEmitter.particleColorEnd "#000000"' },
  particleGravityX: { description: "World-space gravity X in canvas-units/sec\xB2 (default 0)", type: "number", example: "set MyEmitter.particleGravityX 0.1" },
  particleGravityY: { description: "World-space gravity Y in canvas-units/sec\xB2 (default 0)", type: "number", example: "set MyEmitter.particleGravityY 0.2" },
  particleDrag: { description: "Velocity damping 0-1 per second (default 0)", type: "number", example: "set MyEmitter.particleDrag 0.5" },
  emitterGlow: { description: "Halo glow intensity 0-1 (default 0 = off)", type: "number", example: "set MyEmitter.emitterGlow 0.6" },
  emitterGlowSize: { description: "Halo size multiplier relative to emitter shape (default 1.5)", type: "number", example: "set MyEmitter.emitterGlowSize 2" },
  emitterGlowFlicker: { description: "Halo flicker amplitude 0-1 (default 0 = steady)", type: "number", example: "set MyEmitter.emitterGlowFlicker 0.3" }
};
var CELL_SCRIPTABLE_PROPERTIES = {
  backgroundColor: { description: "Cell background color", type: "color", example: 'set Cell.backgroundColor "#ff0000"' },
  backgroundPattern: { description: "Cell background pattern", type: "string", example: 'set Cell.backgroundPattern "grid"' },
  patternColor: { description: "Pattern overlay color", type: "color", example: 'set Cell.patternColor "rgba(0,0,0,0.2)"' },
  patternScale: { description: "Pattern scale (0.5-2)", type: "number", example: "set Cell.patternScale 1.5" },
  gravity: { description: "Vertical force for dynamics (0 = none)", type: "number", example: "set Cell.gravity 0.5", notes: "Applies to movable objects" },
  wind: { description: "Wind magnitude (0 = none)", type: "number", example: "set Cell.wind 0.5", notes: "Direction set by windAngle" },
  windAngle: { description: "Wind direction in degrees (0 = right, 90 = down, 180 = left, 270 = up)", type: "number", example: "set Cell.windAngle 90" },
  airResistance: { description: "Drag coefficient (0 = vacuum, 0.1 = air, 1 = water-like)", type: "number", example: "set Cell.airResistance 0.1", notes: "Creates natural terminal velocity: v_terminal \u2248 gravity / airResistance" },
  timeScale: { description: "Time scale for all objects (0=paused, 0.5=half speed, 1=normal, 2=double). Per-object timeScale overrides this", type: "number", example: "set Cell.timeScale 0" },
  width: { description: "Canvas width in world units (read-only)", type: "number", example: "Cell.width" },
  height: { description: "Canvas height in world units (read-only)", type: "number", example: "Cell.height" }
};
var FILL_LAYER_PROPERTIES = [
  // Color layer
  { name: "color.color", layerType: "color", property: "color", type: "color", description: "Base color", example: 'set Box.color.color "#00ff00"' },
  { name: "color.opacity", layerType: "color", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Box.color.opacity 0.5" },
  // Gradient layer
  { name: "gradient.angle", layerType: "gradient", property: "angle", type: "number", description: "Rotation angle (0-360)", example: "set Sky.gradient.angle 180" },
  { name: "gradient.gradientType", layerType: "gradient", property: "gradientType", type: "string", description: "linear or radial", example: 'set Sky.gradient.gradientType "radial"' },
  { name: "gradient.opacity", layerType: "gradient", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Sky.gradient.opacity 0.8" },
  // Pattern layer
  { name: "pattern.pattern", layerType: "pattern", property: "pattern", type: "string", description: "Pattern type", example: 'set Floor.pattern.pattern "grid"' },
  { name: "pattern.color", layerType: "pattern", property: "color", type: "color", description: "Pattern color", example: 'set Floor.pattern.color "#ff0000"' },
  { name: "pattern.scale", layerType: "pattern", property: "scale", type: "number", description: "Pattern scale", example: "set Floor.pattern.scale 2" },
  { name: "pattern.opacity", layerType: "pattern", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Floor.pattern.opacity 0.5" },
  // Noise layer
  { name: "noise.noiseType", layerType: "noise", property: "noiseType", type: "string", description: "fractalNoise or turbulence", example: 'set Clouds.noise.noiseType "turbulence"' },
  { name: "noise.scale", layerType: "noise", property: "scale", type: "number", description: "Noise scale", example: "set Clouds.noise.scale 1.5" },
  { name: "noise.intensity", layerType: "noise", property: "intensity", type: "number", description: "Noise intensity (0-1)", example: "set Clouds.noise.intensity 0.8" },
  { name: "noise.monochrome", layerType: "noise", property: "monochrome", type: "boolean", description: "Grayscale noise", example: "set Clouds.noise.monochrome true" },
  { name: "noise.opacity", layerType: "noise", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Clouds.noise.opacity 0.5" },
  // Image layer
  { name: "image.mode", layerType: "image", property: "mode", type: "string", description: "fill, fit, or tile", example: 'set Photo.image.mode "fit"' },
  { name: "image.scale", layerType: "image", property: "scale", type: "number", description: "Image scale", example: "set Photo.image.scale 1.5" },
  { name: "image.opacity", layerType: "image", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Photo.image.opacity 0.8" },
  // Inner shadow layer
  { name: "innerShadow.color", layerType: "innerShadow", property: "color", type: "color", description: "Inner shadow color", example: 'set Box.innerShadow.color "rgba(0,0,0,0.5)"' },
  { name: "innerShadow.blur", layerType: "innerShadow", property: "blur", type: "number", description: "Inner shadow blur radius (px)", example: "set Box.innerShadow.blur 12" },
  { name: "innerShadow.offsetX", layerType: "innerShadow", property: "offsetX", type: "number", description: "Inner shadow X offset (px)", example: "set Box.innerShadow.offsetX 4" },
  { name: "innerShadow.offsetY", layerType: "innerShadow", property: "offsetY", type: "number", description: "Inner shadow Y offset (px)", example: "set Box.innerShadow.offsetY 4" },
  { name: "innerShadow.opacity", layerType: "innerShadow", property: "opacity", type: "number", description: "Layer opacity (0-1)", example: "set Box.innerShadow.opacity 0.7" }
];
function generateSyntaxReference() {
  const sections = [];
  sections.push("EVENTS");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(EVENTS)) {
    sections.push(`  ${name}:`.padEnd(20) + def.description);
  }
  sections.push(`  event | event:`.padEnd(20) + "Combined events");
  sections.push("");
  sections.push("ACTIONS");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(ACTIONS)) {
    sections.push(`  ${name}`.padEnd(20) + def.description);
  }
  sections.push("");
  sections.push("TRANSITIONS (with ...)");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(TRANSITIONS)) {
    sections.push(`  ${name}`.padEnd(20) + def.description);
  }
  sections.push("");
  sections.push("FUNCTIONS");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(FUNCTIONS)) {
    sections.push(`  ${name}()`.padEnd(20) + def.description);
  }
  sections.push("");
  sections.push("VARIABLES");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(VARIABLES)) {
    sections.push(`  ${name}`.padEnd(20) + def.description);
  }
  sections.push("");
  sections.push("OPERATORS");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(OPERATORS2)) {
    sections.push(`  ${name}`.padEnd(20) + def.description);
  }
  sections.push("");
  sections.push("CONCEPTS");
  sections.push("-".repeat(40));
  for (const [name, def] of Object.entries(CONCEPTS)) {
    sections.push(`  ${name}`.padEnd(24) + def.description);
  }
  sections.push("");
  sections.push("COMMENTS");
  sections.push("-".repeat(40));
  sections.push(`  // comment`.padEnd(20) + "Line or inline comment");
  return sections.join("\n");
}
function generateUserManual() {
  const sections = [];
  sections.push("# Purl Studio Script Reference");
  sections.push("");
  sections.push("Complete reference for the Purl Studio scripting language.");
  sections.push("");
  sections.push("## Events");
  sections.push("");
  sections.push("Events define when scripts run.");
  sections.push("");
  for (const [name, def] of Object.entries(EVENTS)) {
    const eventDef = def;
    sections.push(`### ${name}`);
    sections.push("");
    sections.push(eventDef.longDescription);
    sections.push("");
    sections.push("**Valid for:** " + eventDef.validFor.join(", "));
    sections.push("");
    if (eventDef.parameters?.length) {
      sections.push("**Parameters:**");
      for (const param of eventDef.parameters) {
        const opt = param.optional ? " (optional)" : "";
        sections.push(`- \`${param.name}\`: ${param.type}${opt} - ${param.description}`);
      }
      sections.push("");
    }
    sections.push("**Example:**");
    sections.push("```");
    sections.push(eventDef.example);
    sections.push("```");
    sections.push("");
    if (eventDef.notes) {
      sections.push(`> ${eventDef.notes}`);
      sections.push("");
    }
  }
  sections.push("### Combined Events");
  sections.push("");
  sections.push(COMBINED_EVENTS_INFO.longDescription);
  sections.push("");
  sections.push("**Example:**");
  sections.push("```");
  sections.push(COMBINED_EVENTS_INFO.example);
  sections.push("```");
  sections.push("");
  if (COMBINED_EVENTS_INFO.notes) {
    sections.push(`> ${COMBINED_EVENTS_INFO.notes}`);
    sections.push("");
  }
  sections.push("## Actions");
  sections.push("");
  sections.push("Actions are commands that do things.");
  sections.push("");
  for (const [name, def] of Object.entries(ACTIONS)) {
    const actionDef = def;
    sections.push(`### ${name}`);
    sections.push("");
    sections.push(actionDef.longDescription);
    sections.push("");
    if (actionDef.parameters.length) {
      sections.push("**Parameters:**");
      for (const param of actionDef.parameters) {
        const opt = param.optional ? " (optional)" : "";
        sections.push(`- \`${param.name}\`: ${param.type}${opt} - ${param.description}`);
      }
      sections.push("");
    }
    sections.push("**Example:**");
    sections.push("```");
    sections.push(actionDef.example);
    sections.push("```");
    sections.push("");
    if (actionDef.notes) {
      sections.push(`> ${actionDef.notes}`);
      sections.push("");
    }
  }
  sections.push("## Transitions");
  sections.push("");
  sections.push("Transitions animate actions. Use with `with` keyword.");
  sections.push("");
  sections.push("| Transition | Description | Works with |");
  sections.push("|------------|-------------|------------|");
  for (const [name, def] of Object.entries(TRANSITIONS)) {
    sections.push(`| ${name} | ${def.description} | ${def.validFor.join(", ")} |`);
  }
  sections.push("");
  sections.push('**Example:** `goto "Room" with fade 500`');
  sections.push("");
  sections.push("## Functions");
  sections.push("");
  sections.push("Functions return values for use in conditions.");
  sections.push("");
  for (const [name, def] of Object.entries(FUNCTIONS)) {
    sections.push(`### ${name}()`);
    sections.push("");
    sections.push(def.longDescription);
    sections.push("");
    if (def.parameters.length) {
      sections.push("**Parameters:**");
      for (const param of def.parameters) {
        sections.push(`- \`${param.name}\`: ${param.type} - ${param.description}`);
      }
      sections.push("");
    }
    sections.push(`**Returns:** ${def.returns}`);
    sections.push("");
    sections.push("**Example:**");
    sections.push("```");
    sections.push(def.example);
    sections.push("```");
    sections.push("");
  }
  sections.push("## Built-in Variables");
  sections.push("");
  for (const [name, def] of Object.entries(VARIABLES)) {
    sections.push(`### ${name}`);
    sections.push("");
    sections.push(def.longDescription);
    sections.push("");
    sections.push(`**Type:** ${def.type}`);
    sections.push("");
    sections.push("**Example:**");
    sections.push("```");
    sections.push(def.example);
    sections.push("```");
    sections.push("");
  }
  sections.push("## Key Concepts");
  sections.push("");
  for (const [name, def] of Object.entries(CONCEPTS)) {
    sections.push(`### ${name}`);
    sections.push("");
    sections.push(def.longDescription);
    sections.push("");
    sections.push("**Example:**");
    sections.push("```");
    sections.push(def.example);
    sections.push("```");
    sections.push("");
    if (def.notes) {
      sections.push(`> ${def.notes}`);
      sections.push("");
    }
  }
  sections.push("## Operators");
  sections.push("");
  const controlOps = Object.entries(OPERATORS2).filter(([, def]) => def.category === "control");
  const comparisonOps = Object.entries(OPERATORS2).filter(([, def]) => def.category === "comparison");
  const logicalOps = Object.entries(OPERATORS2).filter(([, def]) => def.category === "logical");
  sections.push("### Control Flow");
  sections.push("");
  for (const [name, def] of controlOps) {
    sections.push(`- \`${name}\` - ${def.description}`);
  }
  sections.push("");
  sections.push("### Comparison");
  sections.push("");
  for (const [name, def] of comparisonOps) {
    sections.push(`- \`${name}\` - ${def.description}`);
  }
  sections.push("");
  sections.push("### Logical");
  sections.push("");
  for (const [name, def] of logicalOps) {
    sections.push(`- \`${name}\` - ${def.description}`);
  }
  sections.push("");
  sections.push("## Scriptable Properties");
  sections.push("");
  sections.push("Object properties that can be read or set at runtime using `Object.property` syntax.");
  sections.push("");
  sections.push("| Property | Type | Description |");
  sections.push("|----------|------|-------------|");
  for (const [name, def] of Object.entries(SCRIPTABLE_PROPERTIES)) {
    sections.push(`| ${name} | ${def.type} | ${def.description} |`);
  }
  sections.push("");
  sections.push("**Examples:**");
  sections.push("```");
  sections.push("set Button1.opacity 0.5");
  sections.push('set Text1.content "Hello"');
  sections.push("if Button1.visible:");
  sections.push("```");
  sections.push("");
  return sections.join("\n");
}
var BUILTIN_ACTIONS = Object.entries(ACTIONS).map(([name, def]) => ({
  name,
  description: def.description,
  example: def.example,
  args: def.parameters
}));
var BUILTIN_FUNCTIONS = Object.entries(FUNCTIONS).map(([name, def]) => ({
  name,
  description: def.description,
  example: def.example,
  args: def.parameters,
  returns: def.returns
}));
var BUILTIN_VARIABLES = Object.entries(VARIABLES).map(([name, def]) => ({
  name,
  description: def.description,
  example: def.example
}));
var LOGIC_OPERATORS = Object.entries(OPERATORS2).map(([name, def]) => ({
  name,
  description: def.description,
  example: def.example
}));
var EVENT_SNIPPETS = Object.entries(EVENTS).map(([name, def]) => ({
  name,
  description: def.description,
  snippet: `${name}:
  `,
  validFor: def.validFor
}));

// src/utils/scriptValidator.ts
var SPECIAL_REFS = /* @__PURE__ */ new Set(["self", "other", "parent", "siblings", "children", "cell", "camera"]);
function validateScriptReferences(events, objectNames, cellLabels) {
  const warnings = [];
  const objectSet = new Set(objectNames.map((n) => n.toLowerCase()));
  const cellSet = new Set(cellLabels.map((l) => l.toLowerCase()));
  for (const event of events) {
    validateStatements(event.statements, objectSet, cellSet, warnings);
  }
  return warnings;
}
function formatWarnings(warnings) {
  return warnings.map(
    (w) => w.line ? `Line ${w.line}: ${w.message}` : w.message
  );
}
function validateStatements(statements, objectSet, cellSet, warnings, loopVariables = /* @__PURE__ */ new Set()) {
  for (const stmt of statements) {
    const line = stmt.loc?.line;
    switch (stmt.type) {
      case "show":
      case "hide": {
        const target = stmt.target.toLowerCase();
        const firstPart = target.split(".")[0];
        if (target === "matched" || target.startsWith("all:") || target.startsWith("tag:")) {
          break;
        }
        if (SPECIAL_REFS.has(firstPart)) {
          break;
        }
        if (loopVariables.has(target)) {
          break;
        }
        if (!objectSet.has(target)) {
          warnings.push({
            message: `"${stmt.target}" not found - check spelling or if object was renamed`,
            line
          });
        }
        break;
      }
      // unlock case removed (dead code cleanup)
      case "goto": {
        if (stmt.direction) break;
        if (stmt.target) {
          const target = stmt.target.toLowerCase();
          if (!cellSet.has(target)) {
            warnings.push({
              message: `Cell "${stmt.target}" not found - check spelling or if cell was renamed`,
              line
            });
          }
        }
        break;
      }
      case "if": {
        validateStatements(stmt.then, objectSet, cellSet, warnings, loopVariables);
        if (stmt.else) {
          validateStatements(stmt.else, objectSet, cellSet, warnings, loopVariables);
        }
        break;
      }
      case "set-property": {
        const target = stmt.object.toLowerCase();
        const firstPart = target.split(".")[0];
        if (target.startsWith("all:") || target.startsWith("tag:")) {
          break;
        }
        if (SPECIAL_REFS.has(firstPart)) {
          break;
        }
        if (loopVariables.has(target)) {
          break;
        }
        if (!objectSet.has(target)) {
          warnings.push({
            message: `"${stmt.object}" not found - check spelling or if object was renamed`,
            line
          });
        }
        break;
      }
      case "shout": {
        break;
      }
      case "first": {
        validateStatements(stmt.body, objectSet, cellSet, warnings, loopVariables);
        if (stmt.else) {
          validateStatements(stmt.else, objectSet, cellSet, warnings, loopVariables);
        }
        break;
      }
      case "foreach": {
        const bodyLoopVars = new Set(loopVariables);
        bodyLoopVars.add(stmt.variable.toLowerCase());
        validateStatements(stmt.body, objectSet, cellSet, warnings, bodyLoopVars);
        break;
      }
      case "next":
      case "prev": {
        if (stmt.else) {
          validateStatements(stmt.else, objectSet, cellSet, warnings, loopVariables);
        }
        break;
      }
    }
  }
}
export {
  ACTIONS,
  CELL_SCRIPTABLE_PROPERTIES,
  CONCEPTS,
  EVENTS,
  FILL_LAYER_PROPERTIES,
  FUNCTIONS,
  OPERATORS2 as OPERATORS,
  SCRIPTABLE_PROPERTIES,
  TRANSITIONS,
  VARIABLES,
  formatParseErrors,
  formatWarnings,
  generateSyntaxReference,
  generateUserManual,
  parseEventScript,
  parseScript,
  validateScriptReferences
};
