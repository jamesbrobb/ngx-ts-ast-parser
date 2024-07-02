import * as fs from "node:fs";
import * as path from "node:path";
import {
    CommonPathHandler,
    LightweightChartsPathHandler,
    NgPathHandler,
    NodeModulesPathHandler,
    parse,
    Parser,
    RxjsPathHandler
} from "@jamesbenrobb/ts-ast-parser";
import {ngDeclarationDefinitionMap} from "../src";


const pathHandlers = [
    new CommonPathHandler(),
    new NodeModulesPathHandler(),
    new RxjsPathHandler(),
    new NgPathHandler(),
    new LightweightChartsPathHandler()
]


function run() {

    const sourcePath = process.argv.slice(2)[0],
      stats = fs.statSync(sourcePath);

    let relativePath = sourcePath;

    if (path.isAbsolute(sourcePath)) {
        relativePath = path.relative(process.cwd(), sourcePath);
    }

    const dir: string = stats.isDirectory() ? relativePath : path.dirname(relativePath);

    // can be empty if cwd === relativePath
    if(dir) {
        process.chdir(dir);
    }

    const parser = new Parser(ngDeclarationDefinitionMap);

    const source = parse(sourcePath, parser, pathHandlers, {walk: true});

    fs.writeFileSync(
      path.join('/Users/James/WebstormProjects/ngx-ts-ast-parser/scripts/output', 'test.json'),
      JSON.stringify(source, null, '  ')
    );
}


run();