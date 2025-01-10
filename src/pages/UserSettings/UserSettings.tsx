import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@selectors/user.selector.ts';
import { setUser, User } from '@reducer/user.reducer.ts';
import { useDeleteUser } from '@services/UserService/User.service.ts';
import { Path } from '@main';
import { Button } from '@components/ui/button.tsx';
import { Card } from '@components/ui/card.tsx';

export const UserSettings = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deleteUserMutation = useDeleteUser();

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      await deleteUserMutation.mutateAsync(user.id);
      dispatch(setUser({} as User));
      navigate(Path.SIGNIN);
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Wystąpił błąd podczas usuwania konta. Spróbuj ponownie później.');
    }
    setShowConfirmation(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Ustawienia użytkownika</h2>

      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Usuń konto</h3>
            <p className="text-sm text-muted-foreground mb-4">Ta operacja jest nieodwracalna</p>
            {!showConfirmation ? (
              <Button
                variant="destructive"
                onClick={() => setShowConfirmation(true)}
                disabled={deleteUserMutation.isPending}
              >
                Usuń konto
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-destructive">
                  Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    disabled={deleteUserMutation.isPending}
                  >
                    Anuluj
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteUserMutation.isPending}
                  >
                    {deleteUserMutation.isPending ? 'Usuwanie...' : 'Potwierdź usunięcie'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 mt-4 bg-destructive/15 text-destructive rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
