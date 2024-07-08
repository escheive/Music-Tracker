import supabase from "./supabase";


const supabaseUserApi = async (req, res) => {
  console.log(userId)
  if (req.method === 'GET') {

    const { data, error } = await supabase
      .from('Profiles')
      .select('*')
      .match({ uuid: userId })

    if (error) {
      return res.status(500).json({message: error})
    }

    return res.status(200).json({data})
  }
}

export default supabaseUserApi