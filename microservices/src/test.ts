import { getRating } from "./utils/Nostr";

getRating('ca7a5ea26c3bf89c2b11b856c614c327b786d95de966eca2d4a38db612ecb3c7')
    .then(rating => console.log(rating));