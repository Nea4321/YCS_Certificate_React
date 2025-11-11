// import { useEffect, useState } from "react";
// import axios from "axios";
// import {useDataFetching} from "@/shared";
// import {departmentApi} from "@/entities";
//
// export const DepartmentSelect = () => {
//     const [departments, setDepartments] = useState<string[]>([]);
//     const [selectedDept, setSelectedDept] = useState<string>("");
//     const { data, error, refetch } = useDataFetching({
//         fetchFn:departmentApi.getDepartment
//     })
//     const [saving, setSaving] = useState(false);
//     const [message, setMessage] = useState<string>("");
//
//     // ✅ 1. 컴포넌트 마운트 시 학과 목록 불러오기
//     useEffect(() => {
//                 const departmentName = data.map((depart) => (depart.department_name))
//                 setDepartments(departmentName);
//
//                 if(error){
//                 console.error(error);
//                 setMessage("학과 목록을 불러오는 데 실패했습니다.");}
//         }
//     ,[data]);
//
//     // ✅ 2. 학과 선택 핸들러
//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedDept(e.target.value);
//     };
//
//     // ✅ 3. 저장 버튼 클릭 시, 선택한 학과를 유저 정보에 저장 요청
//     const handleSave = async () => {
//         if (!selectedDept) {
//             setMessage("학과를 선택해주세요.");
//             return;
//         }
//         try {
//             setSaving(true);
//             await axios.post("/api/user/department", { department: selectedDept });
//             // 예: 백엔드에서 userId는 세션/JWT로 자동 식별
//             setMessage("학과가 성공적으로 저장되었습니다.");
//         } catch (err) {
//             console.error(err);
//             setMessage("저장 중 오류가 발생했습니다.");
//         } finally {
//             setSaving(false);
//         }
//     };
//
//     return (
//         <div className="flex flex-col gap-3 p-4 max-w-sm border rounded-xl bg-gray-50">
//             <label htmlFor="department" className="font-semibold text-gray-700">
//                 학과 선택
//             </label>
//
//             {loading ? (
//                 <p>불러오는 중...</p>
//             ) : (
//                 <select
//                     id="department"
//                     value={selectedDept}
//                     onChange={handleChange}
//                     className="border p-2 rounded-md"
//                 >
//                     <option value="">학과를 선택하세요</option>
//                     {departments.map((dept, idx) => (
//                         <option key={idx} value={dept}>
//                             {dept}
//                         </option>
//                     ))}
//                 </select>
//             )}
//
//             <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
//             >
//                 {saving ? "저장 중..." : "저장"}
//             </button>
//
//             {message && <p className="text-sm text-gray-600">{message}</p>}
//         </div>
//     );
// };
