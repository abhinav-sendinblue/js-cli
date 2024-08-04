#!/usr/bin/env node
const { prompt } = require("inquirer");
const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

const repoUrl = "git@github.com:abhinav-sendinblue/js-templates.git"; // Replace with your repo URL
const tempDir = path.join(os.tmpdir(), "templates-repo");

async function getTemplates() {
  const templatesDir = path.join(tempDir, "templates"); // Assuming templates are under 'templates' directory
  const templates = await fs.readdir(templatesDir);
  return templates;
}

async function getTemplateInstructions(templateDir, projectName) {
  const instructionsFile = path.join(templateDir, "README.md"); // Assuming instructions are in README.md
  if (await fs.pathExists(instructionsFile)) {
    let content = await fs.readFile(instructionsFile, "utf-8");
    // Replace placeholder with actual project name
    content = content.replace(/`project-name`/g, projectName);
    return content;
  }
  return "No specific instructions available for this template.";
}

async function run() {
  try {
    // Step 1: Clone the repo to a temporary location
    const git = simpleGit();
    await fs.remove(tempDir); // Ensure tempDir is clean

    await git.clone(repoUrl, tempDir);

    // Step 2: List available templates
    const templates = await getTemplates();

    // Step 3: Prompt the user to select a template and specify a new project name
    const { template, projectName } = await prompt([
      {
        type: "list",
        name: "template",
        message: "Choose a template to use:",
        choices: templates,
      },
      {
        type: "input",
        name: "projectName",
        message: "Enter the name for your new project:",
        default: "my-project", // Default project name
      },
    ]);

    // Step 4: Copy the selected template to the target directory
    const targetDir = path.join(process.cwd(), projectName); // Use user-specified project name
    const templateDir = path.join(tempDir, "templates", template);

    await fs.copy(templateDir, targetDir);

    console.log("Template copied successfully to", targetDir);

    // Step 5: Display template-specific instructions
    const instructions = await getTemplateInstructions(
      templateDir,
      projectName
    );
    console.log(
      "\nTo complete the setup, follow these instructions:\n\n",
      instructions
    );
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clean up the temporary directory
    await fs.remove(tempDir);
  }
}

run();
