# Gruvbox Userstyles Cleaner

Temporary Chrome helper extension for deleting Gruvbox Userstyles entries from
Stylus without pasting destructive commands into DevTools.

## Use

1. Open Chrome → `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this `tools/stylus-cleaner` folder.
4. Open the **Gruvbox Cleaner** extension popup.
5. Click **Preview**.
6. Review the matched styles, then click **Delete matched styles**.
7. Remove the helper extension when you are done.

Chrome shows a debugger-permission warning because this helper intentionally
controls the Stylus Manage tab to call Stylus' own style API. It downloads a
full backup before deleting and deletes only positive integer style IDs from
the previewed match set.
