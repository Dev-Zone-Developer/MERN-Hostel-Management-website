import bcrypt from 'bcrypt'
async function hashPassword(plainPassword) {
    const saltRounds = 10; // good default
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
}
export {
    hashPassword
}