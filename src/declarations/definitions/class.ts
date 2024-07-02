import {
    ClassDeclaration,
    ConstructorDeclaration,
    DeclarationDefinition,
    GetAccessorDeclaration,
    MethodDeclaration,
    SetAccessorDeclaration,
    classDeclarationDefinition,
    extendDefinition
} from "@jamesbenrobb/ts-ast-parser";
import {isUIClass} from "../helpers";
import {NgPropertyDeclaration} from "./property";



export type NgClassElement = NgPropertyDeclaration | MethodDeclaration | GetAccessorDeclaration | SetAccessorDeclaration | ConstructorDeclaration


export type NgClassDeclaration = ClassDeclaration & {
    isUI: boolean,
    members: NgClassElement[]
}


export const ngClassDeclarationDefinition: DeclarationDefinition<NgClassDeclaration> = extendDefinition(
  classDeclarationDefinition , {
    postProcess: [addUIFlag]
  }
);


function addUIFlag(classDeclaration: NgClassDeclaration): NgClassDeclaration {

    if(isUIClass(classDeclaration)) {
        classDeclaration.isUI = true;
    }

    return classDeclaration;
}
