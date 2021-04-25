import io.javalin.Javalin;
import io.javalin.http.Context;


public class Application {

    static String recipe;

    public static void main(String[] args) {
        Javalin app = Javalin.create().start(7000);
        app.get("/", ctx -> ctx.result("Hello Young Cook"));
        app.post("/recipe", Application::addRecipe);
        app.get("/recipe", Application::getRecipe);
    }

    public static void addRecipe(Context ctx) {
        recipe = ctx.body();
    }

    public static void getRecipe(Context ctx) {
        ctx.result("Twój przepis to: " + recipe);
    }
}
