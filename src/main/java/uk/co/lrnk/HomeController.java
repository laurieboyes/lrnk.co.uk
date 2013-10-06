package uk.co.lrnk;
 
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
 
 
@Controller
public class HomeController {
 
    @RequestMapping(value = "/")
    public String home() {
        return "home";
    }

    @RequestMapping(value = "/little-green-men")
    public String littleGreenMen() {
        return "little-green-men";
    }

    @RequestMapping(value = "/cave")
    public String enterTheLrnkCave() {
        return "lrnk-cave";
    }
}
