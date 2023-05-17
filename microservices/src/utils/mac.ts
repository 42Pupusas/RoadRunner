import * as fs from "fs";
import { ADMINMAC } from "./Utils";

let admin_mac = fs.readFileSync(ADMINMAC).toString('hex');
console.log(admin_mac);