export interface User {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id: string;
  course: string;
  gender?: string;
}

export const registerUser = async (userData: { firstName: string; lastName: string; email: string; studentId: string; course: string; gender: string; password: string }): Promise<User> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        studentId: userData.studentId,
        course: userData.course,
        gender: userData.gender,
        password: userData.password
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    // Fallback to localStorage for development
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === userData.email || u.student_id === userData.studentId);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      _id: Date.now().toString(),
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      student_id: userData.studentId,
      course: userData.course,
      gender: userData.gender
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('currentUser', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    // Fallback to localStorage for development
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
};