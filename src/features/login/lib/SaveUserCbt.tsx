import {UserAddCbtHistory} from "@/features/login";


// cbt 기록 db에 저장하는 함수.
export function SaveUserCbt(certificate_id: number, score: number, correct_count: number, left_time: number) {

    return async () => {
        await UserAddCbtHistory({
            certificate_id: certificate_id,
            score: score,
            correct_Count: correct_count,
            left_time: left_time
        });
    }
}