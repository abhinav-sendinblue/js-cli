#!/usr/bin/env node
const { prompt } = require("inquirer");
const simpleGit = require("simple-git");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");

// Define repositories with base directory and optional specific templates
const repos = [
  {
    url: "git@github.com:abhinav-sendinblue/js-templates.git",
    name: "JS Templates",
    baseDir: "templates",
    specificTemplates: [], // Optional: List specific templates to include
  },
  {
    url: "git@github.com:dtsl/backstage-templates.git",
    name: "Backstage Templates",
    baseDir: "/",
    specificTemplates: ["react-boilerplate", "monorepo-boilerplate"], // Optional: List specific templates to include
  },
  {
    url: "git@github.com:dtsl/backstage-templates.git",
    name: "Monorepo subproject",
    baseDir: "monorepo-boilerplate/packages",
    specificTemplates: ["example"], // Optional: List specific templates to include
  },
];

const tempDir = path.join(os.tmpdir(), "multi-repo-templates");

async function cloneRepos() {
  const git = simpleGit();
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoDir = path.join(tempDir, `repo_${i}`);
    await fs.remove(repoDir); // Ensure repoDir is clean
    await git.clone(repo.url, repoDir);
  }
}

async function getTemplates() {
  let allTemplates = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const repoDir = path.join(tempDir, `repo_${i}`);
    const templatesDir = path.join(repoDir, repo.baseDir);

    if (await fs.pathExists(templatesDir)) {
      const templates = await fs.readdir(templatesDir, { withFileTypes: true });
      for (const template of templates) {
        if (template.isDirectory()) {
          if (repo.specificTemplates && repo.specificTemplates.length > 0) {
            if (repo.specificTemplates.includes(template.name)) {
              allTemplates.push({
                name: `${repo.name}/${template.name}`,
                value: { name: template.name, repoIndex: i },
              });
            }
          } else {
            allTemplates.push({
              name: `${repo.name}/${template.name}`,
              value: { name: template.name, repoIndex: i },
            });
          }
        }
      }
    }
  }
  return allTemplates;
}

async function getTemplateInstructions(templatePath, projectName) {
  const instructionsFile = path.join(templatePath, "README.md");
  if (await fs.pathExists(instructionsFile)) {
    let content = await fs.readFile(instructionsFile, "utf-8");
    content = content.replace(/`project-name`/g, projectName);
    return content;
  }
  return "No specific instructions available for this template.";
}

async function run() {
  try {
    // Step 1: Clone all repositories
    await cloneRepos();

    // Step 2: List available templates from all repos
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
        default: "my-project",
      },
    ]);

    // Step 4: Copy the selected template to the target directory
    const targetDir = path.join(process.cwd(), projectName);
    const templateDir = path.join(
      tempDir,
      `repo_${template.repoIndex}`,
      repos[template.repoIndex].baseDir,
      template.name
    );

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

    // Step 6: Handle specific template names (if needed)
    if (template.name === "specific-template-name") {
      // Add specific handling for this template
      console.log("Applying specific modifications for this template...");
      // Add your custom logic here
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clean up the temporary directory
    await fs.remove(tempDir);
  }
}

run();
