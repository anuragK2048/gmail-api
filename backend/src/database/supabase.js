"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
var supabaseUrl = "https://ebrabxduzugaxcjypzfx.supabase.co";
var supabaseKey = process.env.SUPABASE_KEY;
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default = supabase;
