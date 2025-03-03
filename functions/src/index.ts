import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Anthropic from "@anthropic-ai/sdk";
import { log } from "firebase-functions/logger";

// Initialize Firebase Admin SDK
admin.initializeApp();

interface TransactionRecord {
  date: string;
  description: string;
  category: string;
  type: string;
  value: number;
}

export const transformCsvWithClaude = functions.https.onRequest(
  async (request, response) => {
    // Extract csvText from data
    const { csvText } = request.body?.data || {};
    if (!csvText) {
      log(`req body: ${JSON.stringify(request.body)}`);
      response.status(400).json({
        error: 'The function must be called with a "csvText" argument.',
        body: JSON.stringify(request.body),
      });
      return;
    }

    try {
      // Initialize Anthropic client
      const anthropic = new Anthropic({
        apiKey:
          process.env.ANTHROPIC_API_KEY || functions.config().anthropic.api_key,
      });

      // Make a request to Claude API
      // Create a streaming request to Claude API
      const stream = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 5000,
        stream: true,
        messages: [
          {
            role: "user",
            content: `
              I have the following CSV data:
              
              ${csvText}
              
              Please convert this data into a JSON array of objects. Each object should have these fields:
              - date: string (formatted as YYYY-MM-DD)
              - description: string
              - category: string (infer the category based on the description)
              - type: string (either "income" or "expense", inferred from the context)
              - value: number (positive number)
              
              Only return the valid JSON array, nothing else. Make sure to handle all entries in the CSV.
            `,
          },
        ],
      });

      // Collect the streamed response
      let responseContent = "";
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          responseContent += chunk.delta.text;
        }
      }

      log(responseContent);

      const parsedData: TransactionRecord[] = JSON.parse(responseContent);

      // Validate the parsed data
      const validatedData = parsedData.map((record) => ({
        date: String(record.date),
        description: String(record.description),
        category: String(record.category),
        type: String(record.type),
        value: Number(record.value),
      }));

      // Send the response
      response.json({ success: true, data: validatedData });
    } catch (error) {
      console.error("Error processing CSV with Claude:", error);
      response.status(500).json({
        error: "Failed to process CSV data",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
);
