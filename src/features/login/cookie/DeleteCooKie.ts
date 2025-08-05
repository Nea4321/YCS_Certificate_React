export const DeleteCookie = (name: string): void => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
};