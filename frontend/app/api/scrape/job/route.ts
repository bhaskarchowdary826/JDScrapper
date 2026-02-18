import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const SCRAPER_DIR = path.join(process.cwd(), "..", "scraper");

export async function POST(req: NextRequest) {
  try {
    const { city, keyword } = await req.json();

    if (!city || !keyword) {
      return NextResponse.json({ error: "City and keyword required" }, { status: 400 });
    }

    const records = await runScraper(city, keyword);
    return NextResponse.json({ records, city, keyword });

  } catch (error: any) {
    console.error("Scraper error:", error.message);
    return NextResponse.json({ error: error.message, records: [] }, { status: 500 });
  }
}

function runScraper(city: string, keyword: string): Promise<Record<string, string>[]> {
  return new Promise((resolve) => {
    const scriptPath = path.join(SCRAPER_DIR, "api_scraper.py");

    if (!fs.existsSync(scriptPath)) {
      resolve([]);
      return;
    }

    const process = spawn("python3", [
      scriptPath,
      "--city", city,
      "--keyword", keyword,
      "--output", "json",
    ], {
      cwd: SCRAPER_DIR,
    });

    let output = "";
    let errorOutput = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error("Scraper stderr:", data.toString());
    });

    process.on("close", (code) => {
      if (code !== 0) {
        console.error("Scraper exited with code:", code, errorOutput);
        resolve([]);
        return;
      }

      try {
        const jsonMatch = output.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          resolve(data);
        } else {
          resolve([]);
        }
      } catch {
        console.error("JSON parse error:", output);
        resolve([]);
      }
    });

    setTimeout(() => {
      process.kill();
      resolve([]);
    }, 300000);
  });
}
