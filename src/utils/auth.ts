// Simple local storage auth for development
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  course: string;
}

export const registerUser = async (userData: Omit<User, 'id'> & { password: string }): Promise<User> => {
  // Check if user exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const existingUser = users.find((u: User) => u.email === userData.email || u.studentId === userData.studentId);
  
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    studentId: userData.studentId,
    course: userData.course
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};