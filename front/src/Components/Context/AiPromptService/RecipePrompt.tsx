import React, { useEffect, useState } from 'react';
import { fetchRecipeOfTheDay, CanceledError } from '../../../Services/api-client.ts';
import styles from './RecipePrompt.module.css';

const RecipeOfTheDay: React.FC = () => {
    const [recipe, setRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [parsedRecipe, setParsedRecipe] = useState<{
        title: string;
        description: string;
        details: React.ReactNode[];
    }>({ title: '', description: '', details: [] });

    useEffect(() => {
        const cachedRecipe = localStorage.getItem('recipeOfTheDay');
        const cachedTimestamp = localStorage.getItem('recipeTimestamp');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (cachedRecipe && cachedTimestamp && now - Number(cachedTimestamp) < oneDay) {
            try {
                const parsedRecipe = JSON.parse(cachedRecipe);
                setRecipe(parsedRecipe);
                setLoading(false);
            } catch (e) {
                console.error("Error parsing cached recipe:", e);
                setRecipe(null);
                setLoading(false);
            }
        } else {
            const fetchRecipe = async () => {
                try {
                    const fetchedRecipe = await fetchRecipeOfTheDay();
                    if (fetchedRecipe && typeof fetchedRecipe === 'object') {
                        setRecipe(fetchedRecipe);
                    } else {
                        setRecipe(null);
                    }
                    localStorage.setItem('recipeOfTheDay', JSON.stringify(fetchedRecipe));
                    localStorage.setItem('recipeTimestamp', now.toString());
                } catch (err) {
                    if (err instanceof CanceledError) {
                        return;
                    } else {
                        setError('Failed to fetch recipe.');
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipe().then(() => {});
        }
    }, []);
    useEffect(() => {
        if (recipe && recipe.recipe) {
            const { title, description, details } = parseRecipeContent(recipe.recipe);
            setParsedRecipe({ title, description, details });
        }
    }, [recipe]);
    const parseRecipeContent = (recipeText: string) => {
        let title = "";
        let description = "";
        let detailsText = "";
        const lines = recipeText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== "");
        const titleLine = lines.find(line => line.toLowerCase().startsWith('**title:**'));
        if (titleLine) {
            title = titleLine.split(':').slice(1).join(':').trim();
        } else if (lines.length > 0) {
            title = lines[0];
        }
        const descriptionLine = lines.find(line => line.toLowerCase().startsWith('**description:**'));
        if (descriptionLine) {
            description = descriptionLine.split(':').slice(1).join(':').trim();
        } else if (lines.length > 1) {
            description = lines[1];
        }
        title = title.replace(/^\*\*\s*/, "").replace(/\s*\*\*$/, "").trim();
        description = description.replace(/^\*\*\s*/, "").replace(/\s*\*\*$/, "").trim();
        let startIndex = 0;
        if (descriptionLine) {
            startIndex = lines.indexOf(descriptionLine) + 1;
        } else if (titleLine) {
            startIndex = lines.indexOf(titleLine) + 1;
        } else {
            startIndex = 2;
        }
        detailsText = lines.slice(startIndex).join('\n');
        const details = formatRecipeText(detailsText);

        return { title, description, details };
    };

    const formatRecipeText = (text: string) => {
        const sections = text.split(/(\*\*.*?\*\*)/g);
        const formattedSections: React.ReactNode[] = [];
        let currentContext: string | null = null;

        sections.forEach((section, index) => {
            if (!section.trim()) return;
            if (section.startsWith("**") && section.endsWith("**")) {
                const heading = section
                    .slice(2, -2)
                    .trim()
                    .replace(/^:+|:+$/g, "")
                    .replace(/:$/, "")
                    .toLowerCase();
                formattedSections.push(
                    <h3 key={index} className={styles.sectionHeading}>
                        {heading}
                    </h3>
                );
                currentContext = heading;
            } else {
                if (currentContext === "ingredients") {
                    const ingredientItems = section
                        .split(/,\s*(?![^(]*\))/)
                        .map((item) => item.trim())
                        .filter((item) => item.length > 0);
                    console.log("Ingredient items:", ingredientItems);
                    const ingredientLines: React.ReactNode[] = [];
                    for (let i = 0; i < ingredientItems.length; i += 2) {
                        const firstItem = ingredientItems[i];
                        const secondItem = ingredientItems[i + 1] || "";
                        const lineContent = secondItem ? `${firstItem}, ${secondItem}` : firstItem;
                        ingredientLines.push(
                            <li key={i} className={styles.ingredientItem}>
                                {lineContent}
                            </li>
                        );
                    }

                    formattedSections.push(
                        <ul key={index} className={styles.ingredientsList}>
                            {ingredientLines}
                        </ul>
                    );
                } else {
                    const lines = section
                        .split(/(?<=\.)\s+/)
                        .map((line) => line.trim())
                        .filter((line) => line);
                    const formattedLines = lines.map((line, i) => (
                        <p key={i} className={styles.instructionStep}>
                            {line}
                        </p>
                    ));
                    formattedSections.push(<div key={index}>{formattedLines}</div>);
                }
                currentContext = null;
            }
        });
        return formattedSections;
    };
    if (loading) return <div>Loading recipe of the day...</div>;
    if (error) return <div>{error}</div>;
    if (!recipe) return <div>No recipe available.</div>;

    return (
        <div className={styles.recipeContainer}>
            <div className={styles.recipeCard}>
                <h3 className={styles.recipeTitle}>
                    Recipe Of The Day
                </h3>
                <h4>  {parsedRecipe.title}
                </h4>
                <h6 className={styles.recipeDescription}>
                    {parsedRecipe.description}
                </h6>

                {expanded && (
                    <div className={styles.recipeDetails}>
                        {parsedRecipe.details}
                    </div>
                )}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={styles.toggleButton}
                >
                    {expanded ? "Close" : "View full recipe"}
                </button>
            </div>
        </div>
    );
};

export default RecipeOfTheDay;
