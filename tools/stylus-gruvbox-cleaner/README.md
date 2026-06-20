# Stylus Gruvbox Cleaner

Temporary Chrome helper extension for deleting Gruvbox Userstyles entries from Stylus without pasting destructive commands into DevTools.

## Use

1. Download [this repository as a ZIP](https://github.com/BrigBryu/gruvbox-Userstyles/archive/refs/heads/main.zip) and unzip it.
2. Open Chrome → `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this `tools/stylus-gruvbox-cleaner` folder.
5. Open the **Stylus Gruvbox Cleaner** extension popup.
6. Click **Preview**.
7. Review the matched styles, then click **Delete matched styles**.
8. Remove the helper extension when you are done.

## What It Removes

This is not a general Stylus cleaner. It deletes only matching Gruvbox Userstyles entries:

- new imports with the exact marker `installed-from-id: brigbryu-gruvbox-userstyles`;
- old unmarked imports only when at least two repo signals match, such as this repo URL plus a matching namespace/source reference.

It ignores styles without a positive integer Stylus ID, so malformed matches cannot be passed to Stylus deletion.

## Notes

Chrome shows a debugger-permission warning because this helper intentionally controls the Stylus Manage tab to call Stylus' own style API. It downloads a full backup before deleting and deletes only positive integer style IDs from the previewed match set.
