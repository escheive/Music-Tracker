import supabase from '@api/supabase';

export const createUser = async (email, password, username) => {
  const { data, error } = await supabase
    .from('Users')
    .insert([{ email, password, username }]);

  if (error) {
    console.error('Error creating user: ', error);
    return null;
  }

  return data;
};

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
};

export const updateUser = async (id, updatedFields) => {
  const { data, error } = await supabase
    .from('users')
    .update(updatedFields)
    .eq('id', id);

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return null;
  }

  return data;
};