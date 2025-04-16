import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { AzureChatOpenAI } from "@langchain/openai";

interface PromptVariables {
  [key: string]: string;
}

export function getExtensions(sourceFiles: { filePath: string }[]): string {
  try {
    const extensions = Array.from(
      new Set(
        sourceFiles
          .map((file) => {
            const match = file.filePath.match(/\.[^/.]+$/); // Get last extension like .ts, .js
            return match ? match[0] : null;
          })
          .filter(Boolean)
      )
    );

    return extensions.join(", ");
  } catch (error) {
    console.error("Error while extracting file extensions:", error);
    return "";
  }
}

export function configureTestScript(
  pkg: any,
  sourceFiles: { filePath: string }[]
): { pkg: any; matchedExt: string | null } {
  try {
    pkg.scripts = pkg.scripts || {};
    pkg.devDependencies = pkg.devDependencies || {};

    const matchedExt = getExtensions(sourceFiles);

    const isESM = pkg.type === "module";

    if (!pkg.scripts["test:unit"]) {
      switch (matchedExt) {
        case ".js":
        case ".ts":
        case ".jsx":
        case ".tsx":
          if (isESM) {
            pkg.scripts["test:unit"] = "cross-env NODE_OPTIONS=--experimental-vm-modules jest";
            pkg.devDependencies["cross-env"] = "^7.0.3";
          } else {
            pkg.scripts["test:unit"] = "jest";
          }
          pkg.devDependencies["jest"] = "^29.7.0";
          break;

        case ".vue":
          pkg.scripts["test:unit"] = "vitest";
          break;

        case ".dart":
          pkg.scripts["test:unit"] = "flutter test";
          break;
      }
    }

    return { pkg, matchedExt };
  } catch (error) {
    console.error("Error configuring test script:", error);
    return { pkg, matchedExt: null };
  }
}


export async function createTestConfig(
  pkg: any,
  filePathsOnly: string[],
  matchedExt: string | null
): Promise<any> {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(`
          You are an expert developer responsible for generating test configuration files based on source code and project setup.
    
          Analyze the provided package.json and file extensions to determine the most suitable config.
    
          Important rules:
          - Use file extensions to detect the language and framework.
          - If package.json has \`type: "module"\`, adapt the config accordingly (e.g., use ESM syntax).
          - Only generate config files that are truly necessary.
          - Do not hallucinate tests or configs.
          - Return the required files as a JSON array of objects. Each object must contain:
            {{
                "testPath": string, // e.g. "jest.config.js"
                "testContent": string // content of the config file
            }}
            Your response must be plain JSON — no markdown, no formatting, no comments, and no extra characters.
          `),
      HumanMessagePromptTemplate.fromTemplate(`
            package.json: {pkg}
            source files: {filePathsOnly}
            matched extension: {matchedExt}
          `),
    ]);

    const variables: any = {
      pkg,
      filePathsOnly,
      matchedExt,
    };

    const response = await runPromptWithModel(prompt, variables);
    return response;
  } catch (error) {
    console.error("Error in createTestConfig:", error);
    return null;
  }
}

export async function generateDefaultPackageManager(
  sourceFiles: any[]
): Promise<{ response: any; extensions: string }> {
  try {
    const extensions = getExtensions(sourceFiles);

    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(`
          You are a helpful assistant that generates a complete default package manager configuration based on the programming languages used in a repository.
          For the given file extensions, generate a full default configuration file as it would appear immediately after initializing the project (e.g., using "npm init -y" or "flutter create .") with proper formatting, and add an appropriate test script:
            - ".js" || ".ts" → must include the same: {{ "test:unit": "jest" }}
            - ".vue" → include: {{ "test:unit": "vitest" }}
            - ".dart" → include configuration to run: "flutter test"
          Return the required files as a JSON array of objects. Each object must contain:
            - testPath: the expected file path for the package manager
            - testContent: the full configuration content as a string
          Your response must be plain JSON — no markdown, no formatting, no comments, and no extra characters.
        `),
      HumanMessagePromptTemplate.fromTemplate(`
          File extensions found in the repo: {fileExtensions}
        `),
    ]);

    const variables = { fileExtensions: extensions };
    const response = await runPromptWithModel(prompt, variables);

    return { response, extensions };
  } catch (error) {
    console.error("Error generating default package manager config:", error);
    return { response: null, extensions: "" };
  }
}

export async function runPromptWithModel(
  prompt: ChatPromptTemplate,
  variables: PromptVariables
): Promise<any> {
  try {
    const model = new AzureChatOpenAI({
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
      azureOpenAIApiDeploymentName:
        process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      temperature: Number(process.env.AZURE_OPENAI_API_TEMPERATURE) || 0.2,
    });

    const chain = prompt.pipe(model);

    const response = await chain.invoke(variables);

    return response;
  } catch (error) {
    console.error("Error running prompt with model:", error);
    return null;
  }
}
