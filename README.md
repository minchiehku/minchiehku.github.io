### 1. Prerequisites

Before you start, make sure you have the following:

- A [GitHub account](https://github.com/).
- Basic static website files (e.g., `index.html`, `style.css`, etc.).
- Familiarity with basic Git operations.

### 2. Create a Repository
- Log in to your GitHub account, click the `+` in the top right, and select **New repository**.
- Enter a repository name, recommended format: `<username>.github.io`, for example: `yourusername.github.io`. 
- Set the repository to **Public** and optionally choose **Add a README file**. 
- Click **Create repository** to complete.

### 3. Upload Website Files

- Prepare all the static website files in your local environment (e.g., `index.html`).
- You can upload your files to GitHub in one of the following ways:
    - **Direct Upload via GitHub Web Interface**: Click **Add file** > **Upload files** in the repository, select your files, and upload.
    - **Upload Using Git**: If you are familiar with Git, you can create a local Git repository and push it to GitHub.

   Steps for uploading using Git:

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/yourusername/yourusername.github.io.git
    git push -u origin main
    ```


### 4. Enable GitHub Pages

- Go to your repository page and click **Settings** in the top right.
- In the left sidebar, select **Pages**.
- Under **Source**, select **main branch** and choose **root** as the source for GitHub Pages, then click **Save**.
- Once configured, GitHub will automatically deploy your static site. You should see a green message box with a link to your site, e.g., `https://yourusername.github.io/`.

### 5. Access Your GitHub Pages Website

GitHub will generate and publish your website after the repository settings are configured. You can access your website in a few seconds:

- The URL format will be `https://yourusername.github.io/`.

> Tip: If you cannot access your site immediately, wait a few moments as GitHub may need some time to deploy.
>

### 6. FAQs

- **Q**: My website cannot be accessed, or a 404 page appears.
    - **A**: Check that the repository name follows the `<username>.github.io` format and that GitHub Pages settings are correctly saved.
- **Q**: How do I update the website content?
    - **A**: After updating website files, push the changes with Git or directly upload new files on GitHub, and GitHub will redeploy automatically.
- **Q**: How do I add a custom domain?
    - **A**: In the **Pages** settings, find **Custom domain**, enter your domain name, and set up DNS records with your domain provider.