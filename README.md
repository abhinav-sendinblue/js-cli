# js-cli

`js-cli` is a command-line interface (CLI) tool designed to streamline the creation of new subprojects within a monorepo. It utilizes predefined templates from a private Git repository, facilitating quick and consistent setup of new projects.

## Purpose

The `js-cli` tool aims to simplify the process of creating new subprojects by automating the setup using templates. This tool helps maintain consistency and efficiency across multiple projects within a monorepo.

## Installation

You can use `js-cli` directly with `npx` or install it globally.

### Using with `npx`

To run the CLI tool without installing it globally, use `npx`:

```bash
npx your-command-name
```

### Installing Globally

To install the CLI tool globally, use npm:

```bash
npm install -g js-cli
```

After installation, you can run the CLI tool from anywhere on your system using:

```bash
your-command-name
```

## Usage

1. **Run the CLI Tool**:

   ```bash
   your-command-name
   ```

2. **Follow the Prompts**:
   - **Choose a Template**: Select from the available templates fetched from the private Git repository.
   - **Enter Project Name**: Provide a name for your new subproject.

3. **Post-Setup Instructions**:
   After copying the template to your specified directory, the CLI tool will display template-specific instructions, including commands to run and configurations to apply.

## Configuration

### SSH Access

Ensure that your SSH keys are set up correctly for accessing the private Git repository. If you don't have SSH keys, you can generate them and add them to your GitHub account:

1. Generate an SSH key:

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Add the SSH key to your GitHub account:

   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

   Copy the output and paste it into the SSH keys section of your GitHub account settings.

## Development

To contribute to the development of `js-cli`:

1. **Clone the Repository**:

   ```bash
   git clone git@github.com:abhinav-sendinblue/js-cli.git
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the CLI Tool Locally**:

   ```bash
   npm link
   your-command-name
   ```

4. **Publish Updates**:

   - Update the version number in `package.json`.
   - Publish to npm:

     ```bash
     npm publish
     ```

## Related Documentation

- **GitHub Repository for Templates**: [https://github.com/abhinav-sendinblue/js-templates](https://github.com/abhinav-sendinblue/js-templates)
- **npm Publishing Guide**: [https://docs.npmjs.com/cli/v7/commands/npm-publish](https://docs.npmjs.com/cli/v7/commands/npm-publish)