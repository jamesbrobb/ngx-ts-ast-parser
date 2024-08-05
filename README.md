## Angular specific declarations for @jamesbenrobb/ts-ast-parser

Example usage of `parse` function from `./parser.ts`:

1) [Example file to parse](#1)
2) [Calling the `parse` function](#2)
3) [Example output from `parse`](#3)
---

# 1.

**Example file to parse.**

Given the following file `path/to/my-component.ts`

```ts
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NgFor, NgIf} from "@angular/common";
import {Observable} from "rxjs";


@Component({
  selector: 'my-component',
  templateUrl: 'my-component.html',
  styleUrls: ['my-component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgFor
  ]
})
class MyComponent {

  @Input({required: true}) myRequiredInput?: string;
  @Input('alias') myAliasedInput?: string;

  @Output() myOutput = new EventEmitter<string>();

  public someValue?: Observable<boolean>;

  public myMethod() {
    return 'myMethod';
  }
}
```

# 2.

**Calling the `parse` function**

```ts
import {
  CommonPathHandler,
  NgPathHandler,
  NodeModulesPathHandler,
  RxjsPathHandler,
  Parser,
  parse
} from "@jamesbenrobb/ts-ast-parser";
import {ngDeclarationDefinitionMap} from "@jamesbenrobb/ngx-ts-ast-parser";


const pathHandlers = [
  new CommonPathHandler(),
  new NodeModulesPathHandler(),
  new NgPathHandler(),
  new RxjsPathHandler()
]

const sourcePath = 'path/to/my-component.ts';

const parser = new Parser(ngDeclarationDefinitionMap);

const source = parse(
  sourcePath,
  parser,
  pathHandlers, {
    walk: false,
    debug: false
  }
);

console.log(source);
```

# 3.

**Example output from `parse`**

```json
{
  "fileName": "my-component.ts",
  "path": "path/to/",
  "imports": [
    {
      "name": "Component",
      "module": "@angular/core",
      "resolvedModulePath": "@angular/core",
      "convertedModulePath": "https://angular.dev/api/core/Component"
    },
    {
      "name": "EventEmitter",
      "module": "@angular/core",
      "resolvedModulePath": "@angular/core",
      "convertedModulePath": "https://angular.dev/api/core/EventEmitter"
    },
    {
      "name": "Input",
      "module": "@angular/core",
      "resolvedModulePath": "@angular/core",
      "convertedModulePath": "https://angular.dev/api/core/Input"
    },
    {
      "name": "Output",
      "module": "@angular/core",
      "resolvedModulePath": "@angular/core",
      "convertedModulePath": "https://angular.dev/api/core/Output"
    },
    {
      "name": "NgFor",
      "module": "@angular/common",
      "resolvedModulePath": "@angular/common",
      "convertedModulePath": "https://angular.dev/api/common/NgFor"
    },
    {
      "name": "NgIf",
      "module": "@angular/common",
      "resolvedModulePath": "@angular/common",
      "convertedModulePath": "https://angular.dev/api/common/NgIf"
    },
    {
      "name": "Observable",
      "module": "rxjs",
      "resolvedModulePath": "rxjs",
      "convertedModulePath": "https://rxjs.dev/api/index/class/Observable"
    }
  ],
  "exports": [
    {
      "kind": "ClassDeclaration",
      "name": "MyComponent",
      "isUI": true,
      "modifiers": {
        "decorators": [
          {
            "type": "Component",
            "metadata": {
              "selector": "my-component",
              "templateUrl": "my-component.html",
              "styleUrls": [
                "my-component.css"
              ],
              "standalone": true,
              "imports": [
                "NgIf",
                "NgFor"
              ]
            },
            "signature": "@Component({selector: my-component, templateUrl: my-component.html, styleUrls: my-component.css, standalone: true, imports: NgIf,NgFor})"
          }
        ],
        "keywords": [
          "export"
        ]
      },
      "properties": [
        {
          "kind": "PropertyDeclaration",
          "name": "someValue",
          "type": {
            "kind": "TypeReference",
            "name": "Observable",
            "typeArguments": [
              "boolean"
            ],
            "resolvedPath": "https://rxjs.dev/api/index/class/Observable",
            "signature": "Observable<boolean>"
          },
          "optional": true,
          "modifiers": {
            "keywords": [
              "public"
            ]
          },
          "access": "public",
          "signature": " someValue?: Observable<boolean>"
        }
      ],
      "methods": [
        {
          "kind": "MethodDeclaration",
          "name": "myMethod",
          "parameters": [],
          "modifiers": {
            "keywords": [
              "public"
            ]
          },
          "access": "public",
          "returnType": "string",
          "signature": " myMethod(): string"
        }
      ],
      "inputs": [
        {
          "kind": "PropertyDeclaration",
          "name": "myRequiredInput",
          "type": "string",
          "optional": true,
          "modifiers": {
            "decorators": [
              {
                "type": "Input",
                "metadata": {
                  "required": true
                },
                "signature": "@Input({required: true})"
              }
            ]
          },
          "access": "public",
          "isInput": true,
          "signature": "@Input({required: true})\nmyRequiredInput?: string"
        },
        {
          "kind": "PropertyDeclaration",
          "name": "myAliasedInput",
          "type": "string",
          "optional": true,
          "modifiers": {
            "decorators": [
              {
                "type": "Input",
                "metadata": "alias",
                "signature": "@Input('alias')"
              }
            ]
          },
          "access": "public",
          "isInput": true,
          "signature": "@Input('alias')\nmyAliasedInput?: string"
        }
      ],
      "outputs": [
        {
          "kind": "PropertyDeclaration",
          "name": "myOutput",
          "initializedValue": {
            "expression": "EventEmitter",
            "typeArguments": [
              "string"
            ],
            "arguments": [],
            "signature": "new EventEmitter<string>()"
          },
          "modifiers": {
            "decorators": [
              {
                "type": "Output",
                "signature": "@Output()"
              }
            ]
          },
          "access": "public",
          "isOutput": true,
          "signature": "@Output()\nmyOutput = new EventEmitter<string>()"
        }
      ]
    }
  ]
}
```
