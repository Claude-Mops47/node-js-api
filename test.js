const request = require('supertest');
const app = require('../app');

describe('DELETE /api/users/:id', () => {
  it('deletes a user and returns a success message', async () => {
    // Set up the database and a user
    const user = await User.create({ ... });

    // Make a DELETE request to the endpoint
    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .expect(200);

    // Check that the response contains the expected message
    expect(res.body).toEqual({ message: 'Utilisateur supprimé avec succès' });

    // Check that the user has been deleted from the database
    const deletedUser = await User.findByPk(user.id);
    expect(deletedUser).toBeNull();
  });

  it('returns a 404 status code and error message if user not found', async () => {
    // Make a DELETE request to the endpoint with a non-existent user ID
    const res = await request(app)
      .delete('/api/users/9999')
      .expect(404);

    // Check that the response contains the expected message
    expect(res.body).toEqual({ message: 'Utilisateur non trouvé' });
  });

  it('returns a 500 status code and error message on server error', async () => {
    // Set up the database to throw an error when deleting the user
    jest.spyOn(User, 'destroy').mockImplementationOnce(() => {
      throw new Error('Mock server error');
    });

    // Make a DELETE request to the endpoint
    const res = await request(app)
      .delete('/api/users/1')
      .expect(500);

    // Check that the response contains the expected message
    expect(res.body).toEqual({
      message: 'Une erreur est survenue lors de la suppression de l'utilisateur',
      data: 'Mock server error'
    });
  });
});
