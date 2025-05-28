import crypto from "crypto";
class cryptoSHA256 {
  hash(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }
  compare(password: string, userPassword: string): boolean {
    const hashedEntered = this.hash(password);
    console.log("compare entered", hashedEntered);
    console.log("compate userPass", userPassword);
    return hashedEntered === userPassword;
  }
}
export default new cryptoSHA256();
