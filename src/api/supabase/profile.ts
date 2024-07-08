// import { PostgrestError } from "@supabase/supabase-js";
// import supabase from "./supabase";


// const supabaseUserApi = async (req: { method: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message?: PostgrestError; data?: any[]; }): any; new(): any; }; }; }) => {
//   if (req.method === 'GET') {

//     const { data, error } = await supabase
//       .from('Profiles')
//       .select('*')
//       .match({ uuid: userId })

//     if (error) {
//       return res.status(500).json({message: error})
//     }

//     return res.status(200).json({data})
//   }
// }

// export default supabaseUserApi