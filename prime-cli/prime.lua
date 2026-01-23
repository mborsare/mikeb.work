#!/usr/bin/env lua

local colors = require("ansicolors")
local socket = require("socket")

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
	show_cursor()
	os.exit(1)
end

local function exit_gracefully(message, bullets)
	print()
	print_colored(message or "Session ended", "%{yellow}")
	print()
	print_colored("Bullets remaining: " .. show_bullets(bullets), "%{white}")
	print()
	show_cursor()
	os.exit(0)
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
		os.execute("sleep 0.5")
		return
	end
	os.execute("sleep " .. tonumber(seconds))
end

local function check_end_key()
	local handle = io.popen("bash -c 'read -t 0.001 -n 1 key 2>/dev/null && echo $key'")
	if handle then
		local result = handle:read("*a")
		handle:close()
		if result and (result:match("e") or result:match("E")) then
			return true
		end
	end
	return false
end

-- ======================================================
-- ---- BULLET SYSTEM -----------------------------------
-- ======================================================

local BULLETS_PER_DAY = 3
local TEST_BULLETS = BULLETS_PER_DAY
local bullets_file = os.getenv("HOME") .. "/.prime_bullets"

local function get_bullets_data()
	local file = io.open(bullets_file, "r")
	if not file then
		return { date = os.date("%Y-%m-%d"), count = BULLETS_PER_DAY }
	end

	local content = file:read("*all")
	file:close()

	local date, count = content:match("(%d%d%d%d%-%d%d%-%d%d):(%d+)")
	return { date = date or os.date("%Y-%m-%d"), count = tonumber(count) or BULLETS_PER_DAY }
end

local function save_bullets_data(data)
	local file = io.open(bullets_file, "w")
	if file then
		file:write(data.date .. ":" .. data.count)
		file:close()
	end
end

local function get_current_bullets()
	if TEST_MODE then
		return TEST_BULLETS
	end

	local data = get_bullets_data()
	local today = os.date("%Y-%m-%d")

	if data.date ~= today then
		data.date = today
		data.count = BULLETS_PER_DAY
		save_bullets_data(data)
	end

	return data.count
end

local function use_bullet()
	if TEST_MODE then
		return true
	end

	local data = get_bullets_data()
	local today = os.date("%Y-%m-%d")

	if data.date ~= today then
		data.date = today
		data.count = BULLETS_PER_DAY
	end

	if data.count > 0 then
		data.count = data.count - 1
		save_bullets_data(data)
		return true
	end

	return false
end

local function time_until_restock()
	local now = os.time()
	local tomorrow = os.date("*t")
	tomorrow.day = tomorrow.day + 1
	tomorrow.hour = 0
	tomorrow.min = 0
	tomorrow.sec = 0

	local seconds = os.difftime(os.time(tomorrow), now)
	local hours = math.floor(seconds / 3600)
	local minutes = math.floor((seconds % 3600) / 60)

	return string.format("%d hours %d minutes", hours, minutes)
end

local function show_bullets(bullets)
	local bullet_display = ""
	for i = 1, BULLETS_PER_DAY do
		if i <= bullets then
			bullet_display = bullet_display .. colors("%{bright yellow}●")
		else
			bullet_display = bullet_display .. colors("%{dim}○")
		end
		if i < BULLETS_PER_DAY then
			bullet_display = bullet_display .. " "
		end
	end
	return bullet_display
end

-- ======================================================
-- ---- UNLOCK SEQUENCE ---------------------------------
-- ======================================================

local current_bullets = get_current_bullets()

print_colored(
	[[
 ██▓███   ██▀███   ██▓ ███▄ ▄███▓▓█████ 
▓██░  ██▒▓██ ▒ ██▒▓██▒▓██▒▀█▀ ██▒▓█   ▀ 
▓██░ ██▓▒▓██ ░▄█ ▒▒██▒▓██    ▓██░▒███   
▒██▄█▓▒ ▒▒██▀▀█▄  ░██░▒██    ▒██ ▒▓█  ▄ 
▒██▒ ░  ░░██▓ ▒██▒░██░▒██▒   ░██▒░▒████▒
▒▓▒░ ░  ░░ ▒▓ ░▒▓░░▓  ░ ▒░   ░  ░░░ ▒░ ░
░▒ ░       ░▒ ░ ▒░ ▒ ░░  ░      ░ ░ ░  ░
░░         ░░   ░  ▒ ░░      ░      ░   
            ░      ░         ░      ░  ░
]],
	"%{bright cyan}"
)

print()
print_colored(" * Prime shell activated * ", "%{bright yellow}")
print()
print_colored("Bullets: " .. show_bullets(current_bullets), "%{white}")
print()

if current_bullets == 0 then
	print_colored("⚠ Out of bullets", "%{bright red}")
	print_colored("Bullets restock in: " .. time_until_restock(), "%{yellow}")
	print()
	print_colored("Make it count until then.", "%{white}")
	print()
	os.exit(0)
end

print_colored("Ready to use 1 bullet?", "%{bright white}")
print_colored("  [y] Yes, let's trade", "%{dim}")
print_colored("  [n] No, save it", "%{dim}")
print()

local confirm = TEST_MODE and "y" or get_input("(y/n): ")
if confirm ~= "y" and confirm ~= "Y" then
	exit_gracefully("Bullet saved. Trade another day.", current_bullets)
end

if not use_bullet() then
	exit_with_error("Failed to use bullet")
end

if not TEST_MODE then
	current_bullets = current_bullets - 1
end

print()
print_colored("✔ Bullet used (" .. current_bullets .. " remaining today)", "%{green}")
print()

-- (rest of file continues unchanged)

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
	print_colored("[SKIP] doctrine not found", "%{dim}")
else
	print_colored(" * Match each line (" .. #lines .. " total) * ", "%{yellow}")
	print_colored("Bullets: " .. show_bullets(current_bullets), "%{dim}")
	print()

	for index, line in ipairs(lines) do
		print_colored("﹌﹌﹌﹌﹌﹌", "%{dim}")
		print_colored("[" .. index .. " / " .. #lines .. "]", "%{bright white}")
		print_colored('"' .. line .. '"', "%{cyan}")

		if not TEST_MODE then
			local input = get_input("> ")
			if input ~= "mjb" and input ~= "MJB" then
				exit_with_error("Type mjb to continue")
			end
		else
			print_colored("✔ doctrine auto-passed", "%{dim}")
		end

		print_colored("✔ the work is the win", "%{green}")
		print()
	end
end

-- ======================================================
-- ---- DNS UNBLOCK -------------------------------------
-- ======================================================

print_colored("🔓 Removing Rithmic DNS block…", "%{bright yellow}")
safe_exec("sudo rm -f /usr/local/etc/dnsmasq.d/block-rithmic.conf")
safe_exec("sudo rm -f /etc/resolver/rithmic.com")
safe_exec("sudo brew services restart dnsmasq >/dev/null 2>&1")
print_colored("✔ Enjoy the session", "%{green}")
print()

-- ======================================================
-- ---- RELAUNCH TOOLS ---------------------------------
-- ======================================================

print_colored("🚀 Launching Tools…", "%{bright blue}")
safe_exec("open -a 'MotiveWave' 2>/dev/null || true")
safe_exec("open -a 'Bookmap' 2>/dev/null || true")

print()
print_colored(" * Unlock sequence complete * ", "%{bright yellow}")
print()
print_colored('"Trade the market in front of you, not the one you wish existed."', "%{white}")
print()
print_colored("Bullets: " .. show_bullets(current_bullets), "%{dim}")
print()
print_colored("▶ entering prime", "%{bright cyan}")
print()

safe_sleep(1)

-- ======================================================
-- ---- FLOW WINDOW SELECTION ---------------------------
-- ======================================================

print()
print()
print()
print_colored("Select flow window:", "%{bright white}")
print_colored("Bullets: " .. show_bullets(current_bullets), "%{dim}")
print()
print_colored("  [1]  1 minute", "%{dim}")
print_colored("  [2] 15 minutes", "%{dim}")
print_colored("  [3] 20 minutes", "%{dim}")
print_colored("  [4] 25 minutes", "%{dim}")
print()

local flow_minutes
if TEST_MODE then
	flow_minutes = 1
else
	flow_minutes = ({ ["1"] = 1, ["2"] = 15, ["3"] = 20, ["4"] = 25 })[get_input("Select (1–4): ")]
end

print("\n✔ Flow window set: " .. flow_minutes .. " minutes")
safe_sleep(1)

-- ======================================================
-- ---- WARMUP / TIMER ---------------------------------
-- ======================================================

local GRID_COLS, GRID_ROWS = 81, 6
local GRID_SIZE = GRID_COLS * GRID_ROWS

local warmup_art = [[






   ______     __     _          ______             
  / ____/__  / /_   (_)___     / __/ /___ _      __
 / / __/ _ \/ __/  / / __ \   / /_/ / __ \ | /| / /
/ /_/ /  __/ /_   / / / / /  / __/ / /_/ / |/ |/ / 
\____/\___/\__/  /_/_/ /_/  /_/ /_/\____/|__/|__/  
]]

local ascii_art = [[
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   a
    8   8               8               8           8                   8   8
    8   8   aaaaaaaaa   8   aaaaa   aaaa8aaaa   aaaa8   aaaaa   aaaaa   8   8
    8               8       8   8           8           8   8   8       8   8
    8aaaaaaaa   a   8aaaaaaa8   8aaaaaaaa   8aaaa   a   8   8   8aaaaaaa8   8
    8       8   8               8           8   8   8   8   8           8   8
    8   a   8aaa8aaaaaaaa   a   8   aaaaaaaa8   8aaa8   8   8aaaaaaaa   8   8
    8   8               8   8   8       8           8           8       8   8
    8   8aaaaaaaaaaaa   8aaa8   8aaaa   8   aaaaa   8aaaaaaaa   8   aaaa8   8
    8           8       8   8       8   8       8           8   8           8
    8   aaaaa   8aaaa   8   8aaaa   8   8aaaaaaa8   a   a   8   8aaaaaaaaaaa8
    8       8       8   8   8       8       8       8   8   8       8       8
    8aaaaaaa8aaaa   8   8   8   aaaa8aaaa   8   aaaa8   8   8aaaa   8aaaa   8
    8           8   8           8       8   8       8   8       8           8
    8   aaaaa   8   8aaaaaaaa   8aaaa   8   8aaaa   8aaa8   aaaa8aaaaaaaa   8
    8   8       8           8           8       8   8   8               8   8
    8   8   aaaa8aaaa   a   8aaaa   aaaa8aaaa   8   8   8aaaaaaaaaaaa   8   8
    8   8           8   8   8   8   8           8               8   8       8
    8   8aaaaaaaa   8   8   8   8aaa8   8aaaaaaa8   aaaaaaaaa   8   8aaaaaaa8
    8   8       8   8   8           8           8   8       8               8
    8   8   aaaa8   8aaa8   aaaaa   8aaaaaaaa   8aaa8   a   8aaaaaaaa   a   8
    8   8                   8           8               8               8   8
    8   8aaaaaaaaaaaaaaaaaaa8aaaaaaaaaaa8aaaaaaaaaaaaaaa8aaaaaaaaaaaaaaa8aaa8
]]

-- Pre-build grid lines to avoid rebuilding every frame
local empty_line = "   " .. string.rep(" ", GRID_COLS)
local filled_line = "   " .. colors("%{green}" .. string.rep("*", GRID_COLS))

local session_ended = false

local function draw_timer(elapsed, total_seconds, header_art, bullets)
	local remaining = total_seconds - elapsed
	local filled = math.floor((elapsed * GRID_SIZE) / total_seconds)

	-- Move to home and clear screen in one go
	io.write("\27[H\27[2J")

	-- Header
	if header_art then
		io.write(header_art .. "\n\n")
	end

	-- Timer display with bullets
	io.write(colors("%{bright red}          -" .. format_time(remaining) .. "           \n"))
	io.write(colors("%{dim}          Bullets: " .. show_bullets(bullets) .. "  (press e to end)           \n\n"))

	-- Draw grid efficiently - calculate which rows are filled
	local filled_rows = math.floor(filled / GRID_COLS)
	local partial_cols = filled % GRID_COLS

	for r = 1, GRID_ROWS do
		if r <= filled_rows then
			-- Fully filled row
			io.write(filled_line .. "\n")
		elseif r == filled_rows + 1 and partial_cols > 0 then
			-- Partially filled row
			io.write(
				"   "
					.. colors("%{green}" .. string.rep("=", partial_cols))
					.. string.rep(" ", GRID_COLS - partial_cols)
					.. "\n"
			)
		else
			-- Empty row
			io.write(empty_line .. "\n")
		end
	end

	-- Bottom border marking end of grid
	io.write("   " .. string.rep("-", GRID_COLS) .. "\n")

	io.flush()
end

local function run_timer(minutes, header_art, bullets)
	local total_seconds = minutes * 60
	local start_time = socket.gettime()
	local end_time = start_time + total_seconds
	local frame_time = 1 / 30 -- 30 FPS

	hide_cursor()

	while socket.gettime() < end_time do
		if check_end_key() then
			session_ended = true
			break
		end

		local current_time = socket.gettime()
		draw_timer(current_time - start_time, total_seconds, header_art, bullets)

		-- Sleep until next frame
		local next_frame = current_time + frame_time
		local sleep_time = next_frame - socket.gettime()
		if sleep_time > 0 then
			socket.sleep(sleep_time)
		end
	end

	show_cursor()
end

-- Run warmup timer
run_timer(flow_minutes, warmup_art, current_bullets)

if session_ended then
	exit_gracefully("Session ended early", current_bullets)
end

-- Run live trading session with random duration between 5-7 minutes to bend behavior
local live_minutes = TEST_MODE and 1 or math.random(5, 7)
run_timer(live_minutes, ascii_art, current_bullets)

-- ======================================================
-- ---- PAYOFF ------------------------------------------
-- ======================================================

local payoff_art = {
	{
		color = "%{bright cyan}",
		text = [[


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


]],
	},
	{
		color = "%{bright yellow}",
		text = [[
▗▄▄▖ ▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖    ▗▄▄▖  ▗▄▖▗▖  ▗▖▗▄▄▖                  
▐▌ ▐▌▐▌   ▐▌     █  ▐▌ ▐▌▐▌ ▐▌  █  ▐▛▚▖▐▌  █      ▐▌ ▐▌▐▌ ▐▌▝▚▞▘▐▌                     
▐▛▀▚▖▐▛▀▀▘ ▝▀▚▖  █  ▐▛▀▚▖▐▛▀▜▌  █  ▐▌ ▝▜▌  █      ▐▛▀▘ ▐▛▀▜▌ ▐▌  ▝▀▚▖                  
▐▌ ▐▌▐▙▄▄▖▗▄▄▞▘  █  ▐▌ ▐▌▐▌ ▐▌▗▄█▄▖▐▌  ▐▌  █      ▐▌   ▐▌ ▐▌ ▐▌ ▗▄▄▞▘                  ]],
	},
	{
		color = "%{bright magenta}",
		text = [[
▗▄▄▄▖▗▖  ▗▖ ▗▄▖▗▄▄▄▖▗▄▄▄▖ ▗▄▖ ▗▖  ▗▖ ▗▄▄▖     ▗▄▖ ▗▄▄▖ ▗▄▄▄▖     ▗▄▄▖▗▄▄▄▖▗▄▖▗▄▄▄▖▗▄▄▄▖
▐▌   ▐▛▚▞▜▌▐▌ ▐▌ █    █  ▐▌ ▐▌▐▛▚▖▐▌▐▌       ▐▌ ▐▌▐▌ ▐▌▐▌       ▐▌     █ ▐▌ ▐▌ █  ▐▌   
▐▛▀▀▘▐▌  ▐▌▐▌ ▐▌ █    █  ▐▌ ▐▌▐▌ ▝▜▌ ▝▀▚▖    ▐▛▀▜▌▐▛▀▚▖▐▛▀▀▘     ▝▀▚▖  █ ▐▛▀▜▌ █  ▐▛▀▀▘
▐▙▄▄▖▐▌  ▐▌▝▚▄▞▘ █  ▗▄█▄▖▝▚▄▞▘▐▌  ▐▌▗▄▄▞▘    ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▗▄▄▞▘  █ ▐▌ ▐▌ █  ▐▙▄▄▖]],
	},
	{
		color = "%{bright green}",
		text = [[
 ▗▄▄▖ ▗▄▖ ▗▖  ▗▖▗▄▄▄▖     ▗▄▄▖ ▗▄▖ ▗▖  ▗▖▗▖  ▗▖ ▗▄▖  ▗▄▄▖                              
▐▌   ▐▌ ▐▌▐▛▚▞▜▌▐▌       ▐▌   ▐▌ ▐▌▐▛▚▖▐▌▐▌  ▐▌▐▌ ▐▌▐▌                                 
 ▝▀▚▖▐▛▀▜▌▐▌  ▐▌▐▛▀▀▘    ▐▌   ▐▛▀▜▌▐▌ ▝▜▌▐▌  ▐▌▐▛▀▜▌ ▝▀▚▖                              
▗▄▄▞▘▐▌ ▐▌▐▌  ▐▌▐▙▄▄▖    ▝▚▄▄▖▐▌ ▐▌▐▌  ▐▌ ▝▚▞▘ ▐▌ ▐▌▗▄▄▞▘                              ]],
	},
	{
		color = "%{bright blue}",
		text = [[
 ▗▄▖ ▗▖   ▗▖ ▗▖ ▗▄▖▗▖  ▗▖▗▄▄▖     ▗▄▄▖▗▖  ▗▖▗▄▄▖▗▖   ▗▄▄▄▖▗▖  ▗▖ ▗▄▄▖                  
▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌▝▚▞▘▐▌       ▐▌    ▝▚▞▘▐▌   ▐▌     █  ▐▛▚▖▐▌▐▌                     
▐▛▀▜▌▐▌   ▐▌ ▐▌▐▛▀▜▌ ▐▌  ▝▀▚▖    ▐▌     ▐▌ ▐▌   ▐▌     █  ▐▌ ▝▜▌▐▌▝▜▌                  
▐▌ ▐▌▐▙▄▄▖▐▙█▟▌▐▌ ▐▌ ▐▌ ▗▄▄▞▘    ▝▚▄▄▖  ▐▌ ▝▚▄▄▖▐▙▄▄▖▗▄█▄▖▐▌  ▐▌▝▚▄▞▘                  ]],
	},
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
print_colored("Bullets remaining today: " .. show_bullets(current_bullets), "%{dim}")
print()

-- ======================================================
-- ---- SHUTDOWN / BLOCK -------------------------------
-- ======================================================

safe_exec("pkill -f MotiveWave 2>/dev/null || true")
safe_exec("pkill -f Bookmap 2>/dev/null || true")
safe_exec("sudo mkdir -p /usr/local/etc/dnsmasq.d")
safe_exec("echo 'address=/rithmic.com/127.0.0.1' | sudo tee /usr/local/etc/dnsmasq.d/block-rithmic.conf >/dev/null")
safe_exec("sudo brew services restart dnsmasq >/dev/null 2>&1")

if TEST_MODE then
	print_colored("[TEST MODE COMPLETE]", "%{dim}")
end
