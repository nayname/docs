# Cosmos Documentation Hub

> *A work in progress, striving to unify and provide a single source of truth for all documentation encompassing the broader Cosmos stack.*

## Contributing

1. **Fork the repository**

   - Click “Fork” in the GitHub UI to create your own copy.

3. **Clone your fork**
   
```bash
   git clone https://github.com/<your-username>/cosmos-docs.git
   cd cosmos-docs
````

3. **Create a branch**

```bash
   git checkout -b my-feature
```

4. **Make your changes**

   * Edit or add files under `docs/` as needed.
   * Follow existing file structure and naming conventions.
   * Ensure Markdown is valid and links resolve.

5. **Local testing & validation**

```bash
   # Start a live-reload preview
   npx mint dev

   # Check for broken internal links
   npx mint broken-links

   # Validate OpenAPI specs (if applicable)
   npx mint openapi-check path/to/openapi.yaml
```

   *Source: [Mintlify CLI docs](https://mintlify.com/docs)*
6. **Commit and push**

```bash
   git add .
   git commit -m "Brief description of your change"
   git push origin my-feature
```

7. **Open a Pull Request**

   * On GitHub, navigate to your fork.
   * Click “Compare & pull request.”
   * Provide a concise title and description.
   * Submit the PR for review.


