import * as ts from "typescript";

export interface CodeModel {
    files: FileModel[];
}

export interface FileModel {
    name: string;
    classes: ClassModel[];
}

export interface ClassModel {
    name: string;
    comment: string;
    methods: MethodModel[];
}

export interface MethodModel {
    name: string;
    comment: string;
    returnType: string;
    parameters: ParameterModel[];
}

export interface ParameterModel {
    name: string;
    type: string;
    comment: string;
}

function getChildNodes(parent: ts.Node, kind: ts.SyntaxKind): ts.Node[] {
    const children: ts.Node[] = [];
    ts.forEachChild(parent, (child: ts.Node) => {
        const shouldInclude: boolean = child.kind == kind;
        if(shouldInclude) {
            children.push(child);
        }
    });
    return children;
}

function readFile(sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): FileModel {
    return {
        name: sourceFile.fileName,
        classes: getChildNodes(sourceFile, ts.SyntaxKind.ClassDeclaration)
            .map(n => <ts.ClassDeclaration>n)
            .map((classDeclaration: ts.ClassDeclaration) => readClass(classDeclaration, typeChecker))
    };
}

function readClass(classDeclaration: ts.ClassDeclaration, typeChecker: ts.TypeChecker): ClassModel {
    const classId: ts.Identifier = classDeclaration.name;
    const classSymbol: ts.Symbol = typeChecker.getSymbolAtLocation(classId);
    const className: string = classSymbol.getName();
    const classComment: string = ts.displayPartsToString(classSymbol.getDocumentationComment());
    return {
        name: className,
        comment: classComment,
        methods: getChildNodes(classDeclaration, ts.SyntaxKind.MethodDeclaration)
            .map(n => <ts.MethodDeclaration>n)
            .map((methodDeclaration: ts.MethodDeclaration) => readMethod(methodDeclaration, typeChecker))
    };
}

function readMethod(methodDeclaration: ts.MethodDeclaration, typeChecker: ts.TypeChecker): MethodModel {
    const methodId: ts.PropertyName = methodDeclaration.name;
    const methodSymbol: ts.Symbol = typeChecker.getSymbolAtLocation(methodId);
    const methodName: string = methodSymbol.getName();

    // methodComment includes @returns
    // see https://github.com/Microsoft/TypeScript/issues/9844
    const methodComment: string = ts.displayPartsToString(methodSymbol.getDocumentationComment());

    const methodType: ts.Type = typeChecker.getTypeOfSymbolAtLocation(methodSymbol, methodSymbol.valueDeclaration);
    const callSignatures: ts.Signature[] = methodType.getCallSignatures();

    if(callSignatures.length !== 1) {
        throw new Error("What would it mean if there's more than 1 method signature?");
    }

    const callSignature: ts.Signature = callSignatures[0];
    const returnType: ts.Type = callSignature.getReturnType();
    const returnTypeString: string = typeChecker.typeToString(returnType);

    return {
        name: methodName,
        comment: methodComment,
        returnType: returnTypeString,
        parameters: callSignature.getParameters()
            .map((parameterSymbol: ts.Symbol) => readMethodParameter(parameterSymbol, typeChecker))
    };
}

function readMethodParameter(parameterSymbol: ts.Symbol, typeChecker: ts.TypeChecker): ParameterModel {
    const parameterName: string = parameterSymbol.getName();
    const parameterComment: string = ts.displayPartsToString(parameterSymbol.getDocumentationComment());

    const parameterType: ts.Type = typeChecker.getTypeOfSymbolAtLocation(parameterSymbol, parameterSymbol.valueDeclaration);
    const parameterTypeString: string = typeChecker.typeToString(parameterType);

    return {
        name: parameterName,
        type: parameterTypeString,
        comment: parameterComment
    };
}

export function readCode(fileNames: string[]): CodeModel {
    const program: ts.Program = ts.createProgram(
        fileNames, {
            target: ts.ScriptTarget.ES6,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.NodeJs
        });

    const typeChecker: ts.TypeChecker = program.getTypeChecker();

    const fileModels: FileModel[] = program.getSourceFiles()
        .filter(sourceFile => fileNames.indexOf(sourceFile.fileName) != -1)
        .map((sourceFile: ts.SourceFile) => readFile(sourceFile, typeChecker));

    const codeModel: CodeModel = {
        files: fileModels
    };

    return codeModel;
}
