#!/usr/bin/env lua

local colors = require('ansicolors')
local socket = require('socket')

-- ======================================================
-- ---- TEST MODE --------------------------------------
-- ======================================================

local TEST_MODE = false

-- ======================================================
-- ---- UTILITIES ---------------------------------------
-- ======================================================

local function hide_cursor()
  io.write("\27[?25l")
  io.flush()
end

local function show_cursor()
  io.write("\27[?25h")
  io.flush()
end

local function format_time(seconds)
  local ms = math.floor((seconds * 1000) % 1000)
  local total_sec = math.floor(seconds)
  return string.format("%02d:%02d.%03d", math.floor(total_sec / 60), total_sec % 60, ms)
end

local function print_colored(text, color)
  print(colors(color .. text))
end

local function get_input(prompt, color)
  if TEST_MODE then
    print_colored("[TEST INPUT AUTO-ACCEPTED]", "%{dim}")
    return ""
  end
  io.write(colors((color or "%{bright green}") .. prompt))
  return io.read()
end

local function exit_with_error(message)
  print_colored(message, "%{bright red}")
  os.exit(1)
end

local function safe_exec(cmd)
  if TEST_MODE then
    print_colored("[TEST] " .. cmd, "%{dim}")
    return true
  end
  return os.execute(cmd)
end

local function safe_sleep(seconds)
  if TEST_MODE then
    os.execute("sleep 3")
    return
  end
  os.execute("sleep " .. tonumber(seconds))
end

-- ======================================================
-- ---- UNLOCK SEQUENCE ---------------------------------
-- ======================================================

print_colored([[
 ██▓███   ██▀███   ██▓ ███▄ ▄███▓▓█████ 
▓██░  ██▒▓██ ▒ ██▒▓██▒▓██▒▀█▀ ██▒▓█   ▀ 
▓██░ ██▓▒▓██ ░▄█ ▒▒██▒▓██    ▓██░▒███   
▒██▄█▓▒ ▒▒██▀▀█▄  ░██░▒██    ▒██ ▒▓█  ▄ 
▒██▒ ░  ░░██▓ ▒██▒░██░▒██▒   ░██▒░▒████▒
▒▓▒░ ░  ░░ ▒▓ ░▒▓░░▓  ░ ▒░   ░  ░░░ ▒░ ░
░▒ ░       ░▒ ░ ▒░ ▒ ░░  ░      ░ ░ ░  ░
░░         ░░   ░  ▒ ░░      ░      ░   
            ░      ░         ░      ░  ░
]], "%{bright cyan}")

print()
print_colored(" * Prime shell activated * ", "%{bright yellow}")
print()

-- ======================================================
-- ---- RANDOM EQUATION GATE ----------------------------
-- ======================================================

math.randomseed(os.time())
local A, B, C = math.random(10, 29), math.random(3, 14), math.random(1, 9)
local ANSWER = A * B - C

print_colored("Solve to continue:", "%{white}")
print_colored("(" .. A .. " × " .. B .. ") − " .. C .. " = ?", "%{bright white}")

local user_answer = TEST_MODE and ANSWER or get_input("> ")

if tonumber(user_answer) ~= ANSWER then
  exit_with_error("Check your work and try again")
end

print_colored("✔ restraint pays", "%{green}")
print()

-- ======================================================
-- ---- LINE-BY-LINE STATE GATE -------------------------
-- ======================================================

local script_path = debug.getinfo(1, "S").source:sub(2)
local script_dir = script_path:match("(.*/)")
local doctrine_path = script_dir .. "../backoffice/doctrine.json"

local handle = io.popen("jq -r '.[].doctrineItem' '" .. doctrine_path .. "' 2>/dev/null")

local lines = {}
if handle then
  for line in handle:lines() do
    table.insert(lines, line)
  end
  handle:close()
end

if #lines == 0 then
  print_colored("[TEST] doctrine skipped", "%{dim}")
else
  print_colored(" * Match each line (" .. #lines .. " total) * ", "%{yellow}")
  print()

  for index, line in ipairs(lines) do
    print_colored("﹌﹌﹌﹌﹌﹌", "%{dim}")
    print_colored("[" .. index .. " / " .. #lines .. "]", "%{bright white}")
    print_colored('"' .. line .. '"', "%{cyan}")

    if not TEST_MODE then
      if get_input("> ") ~= line then
        exit_with_error("Can you catch the mistake? Try again")
      end
    else
      print_colored("✔ doctrine auto-passed", "%{dim}")
    end

    print()
  end
end

-- ======================================================
-- ---- DNS UNBLOCK -------------------------------------
-- ======================================================

print_colored("🔓 Removing Rithmic DNS block…", "%{bright yellow}")
safe_exec("sudo rm -f /usr/local/etc/dnsmasq.d/block-rithmic.conf")
safe_exec("sudo rm -f /etc/resolver/rithmic.com")
safe_exec("sudo brew services restart dnsmasq")
print_colored("✔ Enjoy the session", "%{green}")
print()

-- ======================================================
-- ---- RELAUNCH TOOLS ---------------------------------
-- ======================================================

print_colored("🚀 Launching Tools…", "%{bright blue}")
safe_exec("open -a 'MotiveWave'")
safe_exec("open -a 'Bookmap'")

print()
print_colored(" * Unlock sequence complete * ", "%{bright yellow}")
print()
print_colored('"Trade the market in front of you, not the one you wish existed."', "%{white}")
print()
print_colored("▶ entering prime", "%{bright cyan}")
print()

safe_sleep(1)

-- ======================================================
-- ---- FLOW WINDOW SELECTION ---------------------------
-- ======================================================

local flow_minutes = TEST_MODE and 1 or ({["1"]=1,["2"]=15,["3"]=20,["4"]=25})[get_input("Select (1–4): ")]

print("\n✔ Flow window set: " .. flow_minutes .. " minutes")
safe_sleep(1)

-- ======================================================
-- ---- WARMUP / TIMER ---------------------------------
-- ======================================================

local GRID_COLS, GRID_ROWS = 80, 20
local GRID_SIZE = GRID_COLS * GRID_ROWS

local warmup_art = [[






   ______     __     _          ______             
  / ____/__  / /_   (_)___     / __/ /___ _      __
 / / __/ _ \/ __/  / / __ \   / /_/ / __ \ | /| / /
/ /_/ /  __/ /_   / / / / /  / __/ / /_/ / |/ |/ / 
\____/\___/\__/  /_/_/ /_/  /_/ /_/\____/|__/|__/  
]]

local ascii_art = [[





                               ▒██  ███                 
  ▒███▒          █             █░     █             █   
 ░█▒ ░█          █             █      █             █   
 █▒      ███   █████         █████    █    ░███░  █████ 
 █      ▓▓ ▒█    █             █      █    █▒ ▒█    █   
 █   ██ █   █    █             █      █        █    █   
  █   █ █████    █             █      █    ▒████    █   
 █▒   █ █        █             █      █    █▒  █    █   
 ▒█░ ░█ ▓▓  █    █░            █      █░   █░ ▓█    █░  
  ▒███▒  ███▒    ▒██           █      ▒██  ▒██▒█    ▒██ 

   ▄▄▄▄▀ █▄▄▄▄ ██   ██▄   ▄███▄       ▄█▄    ██   █    █▀▄▀█ 
▀▀▀ █    █  ▄▀ █ █  █  █  █▀   ▀      █▀ ▀▄  █ █  █    █ █ █ 
    █    █▀▀▌  █▄▄█ █   █ ██▄▄        █   ▀  █▄▄█ █    █ ▄ █ 
   █     █  █  █  █ █  █  █▄   ▄▀     █▄  ▄▀ █  █ ███▄ █   █ 
  ▀        █      █ ███▀  ▀███▀       ▀███▀     █     ▀   █  
          ▀      █                             █         ▀   
                ▀                             ▀              
    ▄         ▄▄▄▄▄   ▄█   ▄▀     ▄   ▄███▄   ██▄       █▀▄▀█ ▄█ █  █▀ ▄███▄   
▀▄   █       █     ▀▄ ██ ▄▀        █  █▀   ▀  █  █      █ █ █ ██ █▄█   █▀   ▀  
  █ ▀      ▄  ▀▀▀▀▄   ██ █ ▀▄  ██   █ ██▄▄    █   █     █ ▄ █ ██ █▀▄   ██▄▄    
 ▄ █        ▀▄▄▄▄▀    ▐█ █   █ █ █  █ █▄   ▄▀ █  █      █   █ ▐█ █  █  █▄   ▄▀ 
█   ▀▄                 ▐  ███  █  █ █ ▀███▀   ███▀         █   ▐   █   ▀███▀   
 ▀                             █   ██                     ▀       ▀            
                                                                               
      ___   .___________.   .______        ___   .___________.
    /   \  |           |   |   _  \      /   \  |           |
   /  ^  \ `---|  |----`   |  |_)  |    /  ^  \ `---|  |----`
  /  /_\  \    |  |        |   _  <    /  /_\  \    |  |     
 /  _____  \   |  |        |  |_)  |  /  _____  \   |  |     
/__/     \__\  |__|        |______/  /__/     \__\  |__|     
                                                             
 ▄▀▀▄▀▀▀▄  ▄▀▀▄▀▀▀▄  ▄▀▀█▄▄▄▄  ▄▀▀▀▀▄  ▄▀▀█▄▄▄▄  ▄▀▀▄ ▀▄  ▄▀▄▄▄▄   ▄▀▀█▄▄▄▄ 
█   █   █ █   █   █ ▐  ▄▀   ▐ █ █   ▐ ▐  ▄▀   ▐ █  █ █ █ █ █    ▌ ▐  ▄▀   ▐ 
▐  █▀▀▀▀  ▐  █▀▀█▀    █▄▄▄▄▄     ▀▄     █▄▄▄▄▄  ▐  █  ▀█ ▐ █        █▄▄▄▄▄  
   █       ▄▀    █    █    ▌  ▀▄   █    █    ▌    █   █    █        █    ▌  
 ▄▀       █     █    ▄▀▄▄▄▄    █▀▀▀    ▄▀▄▄▄▄   ▄▀   █    ▄▀▄▄▄▄▀  ▄▀▄▄▄▄   
█         ▐     ▐    █    ▐    ▐       █    ▐   █    ▐   █     ▐   █    ▐   
▐                    ▐                 ▐        ▐        ▐         ▐        

                ]]

-- Pre-build grid lines to avoid rebuilding every frame
local empty_line = "   " .. string.rep(" ", GRID_COLS)
local filled_line = "   " .. colors("%{green}" .. string.rep("=", GRID_COLS))

local function draw_timer(elapsed, total_seconds, header_art)
  local remaining = total_seconds - elapsed
  local filled = math.floor((elapsed * GRID_SIZE) / total_seconds)
  
  -- Move to home and clear screen in one go
  io.write("\27[H\27[2J")
  
  -- Header
  if header_art then
    io.write(header_art .. "\n\n")
  end

  -- Timer display
  io.write(colors("%{bright red}          -" .. format_time(remaining) .. "           \n\n"))

  -- Draw grid efficiently - calculate which rows are filled
  local filled_rows = math.floor(filled / GRID_COLS)
  local partial_cols = filled % GRID_COLS
  
  for r = 1, GRID_ROWS do
    if r <= filled_rows then
      -- Fully filled row
      io.write(filled_line .. "\n")
    elseif r == filled_rows + 1 and partial_cols > 0 then
      -- Partially filled row
      io.write("   " .. colors("%{black}" .. string.rep("-", partial_cols)) .. string.rep(" ", GRID_COLS - partial_cols) .. "\n")
    else
      -- Empty row
      io.write(empty_line .. "\n")
    end
  end
  
  -- Bottom border marking end of grid
  io.write("   " .. string.rep("-", GRID_COLS) .. "\n")
  
  io.flush()
end

local function run_timer(minutes, header_art)
  local total_seconds = minutes * 60
  local start_time = socket.gettime()
  local end_time = start_time + total_seconds
  local frame_time = 1 / 30  -- 30 FPS is smooth enough and reduces tearing

  hide_cursor()
  
  while socket.gettime() < end_time do
    local current_time = socket.gettime()
    draw_timer(current_time - start_time, total_seconds, header_art)
    
    -- Sleep until next frame
    local next_frame = current_time + frame_time
    local sleep_time = next_frame - socket.gettime()
    if sleep_time > 0 then
      socket.sleep(sleep_time)
    end
  end
  
  show_cursor()
end

run_timer(flow_minutes, warmup_art)
run_timer(1, ascii_art)

-- ======================================================
-- ---- PAYOFF ------------------------------------------
-- ======================================================

local payoff_art = {
  {color = "%{bright cyan}", text = [[


                                          .`.   _ _
                                        __;_ \ /,//`
                                        --, `._) (
                                         '//,,,  |
                                              )_/
                                             /_|


 _ _   _      _   _                                 
(_) |_( )__  | |_(_)_ __ ___   ___                  
| | __|/ __| | __| | '_ ` _ \ / _ \                 
| | |_ \__ \ | |_| | | | | | |  __/                 
|_|\__||___/  \__|_|_| |_| |_|\___|                 
                                                    
  __                      _                    _    
 / _| ___  _ __    __ _  | |__  _ __ ___  __ _| | __
| |_ / _ \| '__|  / _` | | '_ \| '__/ _ \/ _` | |/ /
|  _| (_) | |    | (_| | | |_) | | |  __/ (_| |   < 
|_|  \___/|_|     \__,_| |_.__/|_|  \___|\__,_|_|\_\



           ^\
 /        //o__o
/\       /  __/
\ \______\  /     
 \         /
  \ \----\ \
   \_\_   \_\_


]]},
  {color = "%{bright yellow}", text = [[
▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖    ▗▄▄▖  ▗▄▖▗▖  ▗▖▗▄▄▖                  
▐▌ ▐▌▐▌   ▐▌     █  ▐▌ ▐▌▐▌ ▐▌  █  ▐▛▚▖▐▌  █      ▐▌ ▐▌▐▌ ▐▌▝▚▞▘▐▌                     
▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █  ▐▛▀▚▖▐▛▀▜▌  █  ▐▌ ▝▜▌  █      ▐▛▀▘ ▐▛▀▜▌ ▐▌  ▝▀▚▖                  
▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▐▌ ▐▌▐▌ ▐▌▗▄█▄▖▐▌  ▐▌  █      ▐▌   ▐▌ ▐▌ ▐▌ ▗▄▄▞▘                  ]]},
  {color = "%{bright magenta}", text = [[
▗▄▄▄▖▗▖  ▗▖ ▗▄▖▗▄▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖ ▗▄▄▖     ▗▄▖ ▗▄▄▖ ▗▄▄▄▖     ▗▄▄▖▗▄▄▄▖▗▄▖▗▄▄▄▖▗▄▄▄▖
▐▌   ▐▛▚▞▜▌▐▌ ▐▌ █    █  ▐▌ ▐▌▐▛▚▖▐▌▐▌       ▐▌ ▐▌▐▌ ▐▌▐▌       ▐▌     █ ▐▌ ▐▌ █  ▐▌   
▐▛▀▀▘▐▌  ▐▌▐▌ ▐▌ █    █  ▐▌ ▐▌▐▌ ▝▜▌ ▝▀▚▖    ▐▛▀▜▌▐▛▀▚▖▐▛▀▀▘     ▝▀▚▖  █ ▐▛▀▜▌ █  ▐▛▀▀▘
▐▙▄▄▖▐▌  ▐▌▝▚▄▞▘ █  ▗▄█▄▖▝▚▄▞▘▐▌  ▐▌▗▄▄▞▘    ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▗▄▄▞▘  █ ▐▌ ▐▌ █  ▐▙▄▄▖]]},
  {color = "%{bright green}", text = [[
 ▗▄▄▖ ▗▄▖ ▗▖  ▗▖▗▄▄▄▖     ▗▄▄▖ ▗▄▖ ▗▖  ▗▖▗▖  ▗▖ ▗▄▖  ▗▄▄▖                              
▐▌   ▐▌ ▐▌▐▛▚▞▜▌▐▌       ▐▌   ▐▌ ▐▌▐▛▚▖▐▌▐▌  ▐▌▐▌ ▐▌▐▌                                 
 ▝▀▚▖▐▛▀▜▌▐▌  ▐▌▐▛▀▀▘    ▐▌   ▐▛▀▜▌▐▌ ▝▜▌▐▌  ▐▌▐▛▀▜▌ ▝▀▚▖                              
▗▄▄▞▘▐▌ ▐▌▐▌  ▐▌▐▙▄▄▖    ▝▚▄▄▖▐▌ ▐▌▐▌  ▐▌ ▝▚▞▘ ▐▌ ▐▌▗▄▄▞▘                              ]]},
  {color = "%{bright blue}", text = [[
 ▗▄▖ ▗▖   ▗▖ ▗▖ ▗▄▖▗▖  ▗▖▗▄▄▖     ▗▄▄▖▗▖  ▗▖▗▄▄▖▗▖   ▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖                  
▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌▝▚▞▘▐▌       ▐▌    ▝▚▞▘▐▌   ▐▌     █  ▐▛▚▖▐▌▐▌                     
▐▛▀▜▌▐▌   ▐▌ ▐▌▐▛▀▜▌ ▐▌  ▝▀▚▖    ▐▌     ▐▌ ▐▌   ▐▌     █  ▐▌ ▝▜▌▐▌▝▜▌                  
▐▌ ▐▌▐▙▄▄▖▐▙█▟▌▐▌ ▐▌ ▐▌ ▗▄▄▞▘    ▝▚▄▄▖  ▐▌ ▝▚▄▄▖▐▙▄▄▖▗▄█▄▖▐▌  ▐▌▝▚▄▞▘                  ]]}
}

-- Clear screen before payoff
os.execute("clear")

for _, art in ipairs(payoff_art) do
  print()
  print_colored(art.text, art.color)
end

print()
print_colored("States are chemical. They come and go. You are all of them. Discipline is state control.", "%{white}")
print()

-- ======================================================
-- ---- SHUTDOWN / BLOCK -------------------------------
-- ======================================================

safe_exec("pkill -f MotiveWave")
safe_exec("sudo mkdir -p /usr/local/etc/dnsmasq.d")
safe_exec("sudo brew services restart dnsmasq")

print_colored("[TEST MODE COMPLETE]", "%{dim}")