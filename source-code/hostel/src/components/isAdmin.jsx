export const isAdmin = async () => {
    try {
        const res = await fetch("/auth/check-auth", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('cookie')}`
            },
            credentials: "include",
        });

        return await res.json();
    } catch (err) {
        console.error("Failed to check login:", err);
        return { loggedIn: false };
    }
};
