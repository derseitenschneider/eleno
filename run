#!/usr/bin/env bash

osascript -e 'tell application "Google Chrome"
    open location "https://dashboard.stripe.com/test/dashboard"
    open location "https://supabase.com/dashboard/project/brhpqxeowknyhrimssxw"
    open location "http://localhost:5173"

    -- Activate Chrome (Important to ensure keystroke goes to Chrome)
    activate

    -- Delay briefly to ensure tabs are open (adjust if needed)
    delay 0.5

    -- Open the console (Command+Option+J)
    tell application "System Events"
        keystroke "j" using {command down, option down}
    end tell
end tell'

