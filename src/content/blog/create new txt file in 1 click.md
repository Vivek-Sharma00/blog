---
title: "Stop Right-Clicking: Spawn a New Text File in Windows with One Click"
description: "Windows 11 made creating new text files laggy and frustrating. Here is a lightweight batch script to spawn numbered notes instantly—plus how to bind it to a global hotkey."
pubDate: 2026-11-16
image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
tags: ["windows", "productivity", "automation", "cli"]
---

Creating a quick scratchpad file in Windows used to be second nature: right-click, hover over **New**, click **Text Document**, and start typing.

In Windows 11, that workflow feels broken. The context menu has noticeable lag, options frequently rearrange themselves, and every few months a Windows Update or Notepad package reset mysteriously deletes the "New Text Document" option from the registry entirely.

If you take quick notes throughout the day, you don't need a bulky GUI menu. A tiny 10-line batch script can generate a fresh, collision-free text file in the active folder—and immediately launch it in your editor.

## The Script: Auto-Incrementing Text Generator

Open Notepad, paste the following code, and save the file as `create_txt.bat`:

```bat
@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "COUNT=1"
:check
if exist "note_!COUNT!.txt" (
    set /a COUNT+=1
    goto check
)

type nul > "note_!COUNT!.txt"
start "" notepad "note_!COUNT!.txt"
```

> **Important during saving:** In Notepad's save dialog, change **Save as type** from *Text Documents (*.txt)* to **All Files (*.*)**. Otherwise, Windows will sneakily save it as `create_txt.bat.txt`.

## How the Script Works Under the Hood

Despite being only a few lines, there are a few subtle batch mechanisms that keep this reliable:

1. **`cd /d "%~dp0"`**:  
   `%~dp0` is a special parameter in Windows batch scripts that expands to the full drive and directory path of the folder where the script lives. This guarantees the file is always created right next to the script, regardless of where your terminal was invoked from.
2. **`setlocal enabledelayedexpansion`**:  
   Standard batch files evaluate variables only once at parse time. Enabling delayed expansion allows `!COUNT!` to evaluate dynamically inside the `:check` loop as it increments.
3. **`type nul > ...`**:  
   This creates an empty 0-byte file without locking the file handle.
4. **`start "" notepad ...`**:  
   Instead of just creating an empty file you have to hunt down and double-click, this immediately launches it in Notepad so you can start typing without taking your hands off the keyboard.

## Taking It Further: Turning It into a Global Keyboard Shortcut

Double-clicking the script is already faster than digging through right-click menus, but you can turn this into a zero-click keyboard shortcut:

1. Right-click your `create_txt.bat` file → **Show more options** → **Create shortcut**.
2. Move the newly created shortcut (`create_txt.bat - Shortcut`) to your desktop or an easily accessible directory.
3. Right-click the shortcut → **Properties**.
4. Click into the **Shortcut key** field and press a key combination (e.g., `Ctrl + Alt + N`).
5. Set **Run** to **Minimized** (this prevents the black command prompt window from flashing on your screen).
6. Click **Apply** and **OK**.

Now, pressing `Ctrl + Alt + N` instantly generates `note_1.txt`, increments the counter if previous notes already exist, and pops open your scratchpad.

## Alternative: Timestamped Notes Instead of Counters

If you prefer logging notes by time rather than arbitrary numbers (`note_1.txt`, `note_2.txt`), replace the loop with an ISO-style timestamp:

```bat
@echo off
cd /d "%~dp0"

:: Extracts YYYYMMDD_HHMM
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "DT=%%I"
set "TIMESTAMP=%DT:~0,8%_%DT:~8,4%"

set "FILENAME=note_%TIMESTAMP%.txt"
type nul > "%FILENAME%"
start "" notepad "%FILENAME%"
```

This keeps your scratchpad files sorted chronologically in File Explorer, eliminating collisions without needing an increment loop.

---

A quick batch file won't replace a full second-brain app like Obsidian or Notion, but for rapid-fire terminal output, temporary clipboard dumps, or daily scratchpads, keeping the friction at zero is unbeatable.