document.addEventListener("DOMContentLoaded", () => {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".section");
  const recipeForm = document.getElementById("recipe-form");
  const recipesContainer = document.getElementById("recipes-container");
  const filterCategory = document.getElementById("filter-category");
  const themeToggle = document.getElementById("theme-toggle");
  const formattingButtons = document.querySelectorAll(
    ".formatting-buttons button"
  );
  const descriptionTextarea = document.getElementById("recipe-description");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === targetId) {
          section.classList.add("active");
        }
      });
    });
  });

  formattingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.dataset.format;
      const textarea = descriptionTextarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      let formattedText = "";

      switch (format) {
        case "bold":
          formattedText = `<strong>${selectedText}</strong>`;
          break;
        case "italic":
          formattedText = `<em>${selectedText}</em>`;
          break;
        case "underline":
          formattedText = `<u>${selectedText}</u>`;
          break;
      }

      textarea.value =
        textarea.value.substring(0, start) +
        formattedText +
        textarea.value.substring(end);
    });
  });

  recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newRecipe = {
      id: Date.now(),
      name: document.getElementById("recipe-name").value,
      description: document.getElementById("recipe-description").value,
      ingredients: document
        .getElementById("ingredients")
        .value.split("\n")
        .filter((i) => i.trim()),
      category: document.getElementById("category").value,
    };

    recipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    recipeForm.reset();
    displayRecipes();
  });

  filterCategory.addEventListener("change", displayRecipes);

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
      "darkMode",
      document.body.classList.contains("dark-mode")
    );
  });

  function displayRecipes() {
    const selectedCategory = filterCategory.value;
    const filteredRecipes =
      selectedCategory === "all"
        ? recipes
        : recipes.filter((recipe) => recipe.category === selectedCategory);

    recipesContainer.innerHTML = filteredRecipes
      .map(
        (recipe) => `
            <div class="recipe-card">
                <span class="category">${recipe.category}</span>
                <h3>${recipe.name}</h3>
                <div class="description">${recipe.description}</div>
                <table class="ingredients-table">
                    <thead>
                        <tr>
                            <th>Ingredients</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recipe.ingredients
                          .map(
                            (ingredient) => `
                            <tr>
                                <td>${ingredient}</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `
      )
      .join("");
  }

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  displayRecipes();
});
