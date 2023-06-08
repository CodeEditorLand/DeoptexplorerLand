// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as path from 'path';

export async function run(testsRoot: string, reportTestResults: (error?: Error, failures?: number) => void): Promise<void> {
    const jest = await import("jest");
    const runCLI = jest.runCLI ?? jest.default.runCLI;
    const projectRootPath = path.resolve(__dirname, "../..");
    const config = path.resolve(projectRootPath, "jest.config.js");

    type Argv = Parameters<typeof runCLI>[0];

    const cliResult = await runCLI({
        config,
        rootDir: projectRootPath,
        runInBand: true,
    } as Argv, [projectRootPath]);

    for (const testResult of cliResult.results.testResults) {
        for (const assertResult of testResult.testResults) {
            if (assertResult.status === "failed") {
                console.error(` • ${assertResult.ancestorTitles} - ${assertResult.title} [${assertResult.status}]`);
            }
        }
    }

    if (!cliResult.results.success) {
        process.exitCode = cliResult.results.numFailedTests || -1;
        throw new Error(`One or more tests failed.`);
    }
}