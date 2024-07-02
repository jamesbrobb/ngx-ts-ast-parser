import * as ts from "typescript";
import {
    DeclarationDefinitionMap,
    defaultDeclarationDefinitionMap,
    DefaultDeclarationKindMap,
    DefaultSyntaxKindToTSNodeDeclarationMap
} from "@jamesbenrobb/ts-ast-parser";
import {
    ngClassDeclarationDefinition,
    NgClassDeclaration,
    ngPropertyDeclarationDefinition,
    NgPropertyDeclaration
} from "./definitions";
import {NgMethodDeclaration, ngMethodDeclarationDefinition} from "./definitions";


export type NgSyntaxKindToDeclarationTypeMap = DefaultDeclarationKindMap & {
    [ts.SyntaxKind.ClassDeclaration]: NgClassDeclaration
    [ts.SyntaxKind.PropertyDeclaration]: NgPropertyDeclaration
    [ts.SyntaxKind.MethodDeclaration]: NgMethodDeclaration
}


export const ngDeclarationDefinitionMap: DeclarationDefinitionMap<DefaultSyntaxKindToTSNodeDeclarationMap, NgSyntaxKindToDeclarationTypeMap> = {
    ...defaultDeclarationDefinitionMap,
    [ts.SyntaxKind.ClassDeclaration]: ngClassDeclarationDefinition,
    [ts.SyntaxKind.PropertyDeclaration]: ngPropertyDeclarationDefinition,
    [ts.SyntaxKind.MethodDeclaration]: ngMethodDeclarationDefinition
}