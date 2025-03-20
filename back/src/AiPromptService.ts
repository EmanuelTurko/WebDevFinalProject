import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.AI_API_KEY) {
    console.error("Error: AI_API_KEY is not defined");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let cachedRecipe: { recipe: string | null; timestamp: number } | null = null;

export const getRecipeOfTheDay = async () => {
    const now = Date.now();
    const oneDay =60*60*1000*12;

    if ( !cachedRecipe || now - cachedRecipe.timestamp >= oneDay) {
        try {
            const prompt = `
            Generate a unique recipe of the day with the following structure:
            
            should have: title of the recipe, short description(1-2lines), ingredient list,
            instructions
            none should have any numbering or bullet points
            but mark every end of sentence with a period.
            if you are using bold text make sure to wrap everything for example **Title:** and not **Title**:
            the list of ingredients should be seperated by commas and in an array format.
            the ingredients should contain the amount of that specific ingredient after the ingredient itself
            for example Olive oil, 2 tablespoons.
            all of the amounts should be in the same format, instead of ounces use grams, instead of pound use kg
            instead of Fahrenheit use celsius
           `

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const recipe: string | null = response.text();
            cachedRecipe = { recipe, timestamp: now };
            return recipe;
        } catch (error) {
            throw new Error('Failed to fetch recipe');
        }
    } else {
        return cachedRecipe.recipe;
    }
};
