#!/usr/bin/env python3
"""
Update navigation in docs.json with generated API reference pages
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NavigationUpdater:
    """Updates docs.json navigation with generated API reference pages"""

    def __init__(self, docs_json_path: str = "docs.json"):
        self.docs_json_path = docs_json_path
        self.docs_config = self._load_docs_config()

    def _load_docs_config(self) -> Dict[str, Any]:
        """Load current docs.json configuration"""
        try:
            with open(self.docs_json_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load docs.json: {e}")
            raise

    def update_navigation(self) -> None:
        """Update navigation with generated API reference pages"""
        logger.info("Updating navigation with API reference pages")

        # Find API Reference tab
        api_tab = self._find_api_tab()
        if not api_tab:
            logger.info("Creating new API Reference tab")
            api_tab = {"tab": "API Reference", "pages": []}
            self.docs_config["navigation"]["tabs"].append(api_tab)

        # Update API tab with generated pages
        api_tab["pages"] = self._build_api_navigation()

        # Save updated configuration
        self._save_docs_config()

        logger.info("Navigation updated successfully")

    def _find_api_tab(self) -> Dict[str, Any]:
        """Find existing API Reference tab"""
        tabs = self.docs_config.get("navigation", {}).get("tabs", [])
        for tab in tabs:
            if tab.get("tab") == "API Reference":
                return tab
        return None

    def _build_api_navigation(self) -> List[Dict[str, Any]]:
        """Build navigation structure for API reference pages"""
        navigation = []

        # Scan API reference directories
        api_ref_dir = Path("docs/api-reference")
        if not api_ref_dir.exists():
            logger.warning("API reference directory not found")
            return navigation

        # Group by API type
        api_groups = {
            "cosmos": "Cosmos SDK API",
            "evm": "EVM JSON-RPC API",
            "ibc": "IBC Protocol API"
        }

        for api_type, group_name in api_groups.items():
            api_dir = api_ref_dir / api_type
            if api_dir.exists():
                pages = self._collect_pages(api_dir, f"docs/api-reference/{api_type}")
                if pages:
                    navigation.append({
                        "group": group_name,
                        "pages": pages
                    })

        return navigation

    def _collect_pages(self, directory: Path, base_path: str) -> List[str]:
        """Collect MDX pages from a directory"""
        pages = []

        # Add index page if it exists
        index_file = directory / "index.mdx"
        if index_file.exists():
            pages.append(f"{base_path}/index")

        # Add other MDX files
        for mdx_file in sorted(directory.glob("*.mdx")):
            if mdx_file.name != "index.mdx":
                page_path = f"{base_path}/{mdx_file.stem}"
                pages.append(page_path)

        # Add subdirectories
        for subdir in sorted(directory.iterdir()):
            if subdir.is_dir():
                subpages = self._collect_pages(subdir, f"{base_path}/{subdir.name}")
                if subpages:
                    pages.extend(subpages)

        return pages

    def _save_docs_config(self) -> None:
        """Save updated docs.json configuration"""
        try:
            with open(self.docs_json_path, 'w') as f:
                json.dump(self.docs_config, f, indent=2)
            logger.info(f"Updated {self.docs_json_path}")
        except Exception as e:
            logger.error(f"Failed to save docs.json: {e}")
            raise

def main():
    """Main entry point"""
    updater = NavigationUpdater()
    updater.update_navigation()

if __name__ == "__main__":
    main()