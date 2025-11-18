import type { UserPreviousDTO } from "@/entities/cbt";

export async function fetchUserPrevious(previousId: number): Promise<UserPreviousDTO> {
    const res = await fetch(`/api/user/cbt/previous/${previousId}`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`failed to load previous: ${res.status}`);
    }

    return res.json();
}
