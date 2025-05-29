# Documentation Hub for Cosmos Stack

This repository is the central documentation hub for the Cosmos Stack product.

## Local Development

1. Ensure you have Node.js (v19+).
2. From the project root, run:

   ```bash
   npx mint dev
   ```
3. Open your browser to [http://localhost:3000](http://localhost:3000).

## Contributing

1. Fork the repository and create a branch:

   ```bash
   git checkout -b feature/your-change
   ```
2. Update files under `docs/`.
3. Run:

   ```bash
   mint broken-links
   ```
4. Commit and push:

   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin feature/your-change
   ```
5. Open a pull request against `main`.

### Helpful Commands

* **Check broken links** \[*run before pushing changes*]

  ```bash
  mint broken-links
  ```

* **Rename file and update refs** \[*avoid broken links*]

  ```bash
  mint rename <oldName> <newName>
  ```

* **Validate OpenAPI spec**

  ```bash
  mint openapi-check <file-or-url>
  ```
  
  ---