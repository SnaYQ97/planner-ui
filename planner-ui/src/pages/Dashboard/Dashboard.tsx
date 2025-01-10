// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "@services/AuthService/Auth.service";
import { Path } from "../../main";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@selectors/user.selector";
import { getBankAccounts } from "@selectors/bankAccount.selector";
import { getCategories as getCategoriesSelector } from "@selectors/category.selector";
import { setUser, User } from "@reducer/user.reducer";
import { setBankAccounts } from "@reducer/bankAccount.reducer";
import { setCategories } from "@reducer/category.reducer";
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useGetBankAccounts } from '@services/BankAccountService/BankAccount.service';
import { useGetCategories, useDeleteCategory } from '@services/CategoryService/Category.service';
import { Category } from '../../types/category';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@components/ui/dialog";
import { AddCategoryForm } from '@components/AddCategoryForm/AddCategoryForm';
import { EditCategoryForm } from '@components/EditCategoryForm/EditCategoryForm';
import { UserHeader } from './components/UserHeader/UserHeader';
import { BudgetSummary } from './components/BudgetSummary/BudgetSummary';
import { CategoryList } from './components/CategoryList/CategoryList';
import { ExpenseSection } from './components/ExpenseSection/ExpenseSection';
import { IncomeSection } from './components/IncomeSection/IncomeSection';
import { Button } from "@components/ui/button";
import { SavingsAccountsSection } from './components/SavingsAccountsSection';
import { useGetTransactions } from '@services/TransactionService/Transaction.service';
import { AddSavingsAccountForm } from "@components/AddSavingsAccountForm/AddSavingsAccountForm";
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const Dashboard = () => {
  const user = useSelector(getUser);
  const bankAccounts = useSelector(getBankAccounts);
  const categories = useSelector(getCategoriesSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { data: bankAccountsData } = useGetBankAccounts();
  const { data: categoriesData } = useGetCategories();
  const { data: transactionsData } = useGetTransactions({
    month: selectedMonth.getMonth(),
    year: selectedMonth.getFullYear()
  });
  const deleteCategory = useDeleteCategory();

  useEffect(() => {
    if (bankAccountsData?.data?.accounts) {
      dispatch(setBankAccounts(bankAccountsData.data.accounts));
    }
  }, [bankAccountsData, dispatch]);

  // Update categories in Redux when data changes
  useEffect(() => {
    if (categoriesData?.data?.data) {
      console.log('Categories from API:', categoriesData.data.data);
      const parsedCategories = Array.isArray(categoriesData.data.data) 
        ? categoriesData.data.data 
        : [categoriesData.data.data];
      dispatch(setCategories(parsedCategories));
    }
  }, [categoriesData, dispatch]);

  const mutation = useMutation({
    mutationFn: AuthService().status,
    onError: () => {
      navigate(Path.SIGNIN);
    },
    onSuccess: (response) => {
      dispatch(setUser(response.data.user));
    }
  });

  useEffect(() => {
    if (!user.id) {
      mutation.mutate();
    }
  }, []);

  const handleLogout = () => {
    AuthService().logout().then(() => {
      dispatch(setUser({} as User));
      navigate(Path.SIGNIN);
    });
  };

  const handleSettings = () => {
    navigate(Path.SETTINGS);
  };

  const handleCategorySuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    setShowAddCategoryDialog(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setCategoryToDelete(categoryId);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory.mutateAsync(categoryToDelete);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (error) {
      console.error('Błąd podczas usuwania kategorii:', error);
    } finally {
      setCategoryToDelete(null);
    }
  };

  const totalBudget = categories.reduce((sum: number, cat: Category) => sum + Number(cat.budget), 0);
  const dailyAccount = bankAccountsData?.data?.accounts?.find(
    account => account.accountType === 'DAILY'
  );

  // Obliczanie całkowitego przychodu z bieżącego miesiąca
  const monthlyIncome = transactionsData?.data?.data
    ?.filter((transaction: { type: string }) => transaction.type === 'INCOME')
    ?.reduce((sum: number, transaction: { amount: string | number }) => 
      sum + Number(transaction.amount), 0) || 0;

  // Obliczanie dostępnych środków (saldo + przychody - wydatki)
  const availableFunds = (dailyAccount?.balance || 0);
  
  // Obliczanie pozostałego budżetu do zaplanowania
  const remainingBudget = monthlyIncome - totalBudget;

  const handleMonthChange = (date: Date) => {
    setSelectedMonth(date);
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <UserHeader 
          user={user}
          onLogout={handleLogout}
          onSettings={handleSettings}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </motion.div>

      {/* Górna sekcja z planowanymi wydatkami i wydatkami */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* Lewa kolumna z planowanymi wydatkami */}
        <motion.div 
          className="flex-1 min-w-[300px] space-y-6"
          variants={itemVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <BudgetSummary
              categories={categories}
              totalBudget={totalBudget}
              remainingBudget={remainingBudget}
              totalIncome={monthlyIncome}
              availableFunds={availableFunds}
              selectedMonth={selectedMonth}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <CategoryList
              categories={categories}
              onAddCategory={() => setShowAddCategoryDialog(true)}
              onEditCategory={setSelectedCategory}
              onDeleteCategory={handleDeleteCategory}
              totalBudget={totalBudget}
            />
          </motion.div>
        </motion.div>

        {/* Prawa kolumna z wydatkami */}
        <motion.div 
          className="flex-1 min-w-[300px]"
          variants={itemVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <ExpenseSection selectedMonth={selectedMonth} />
          </motion.div>
        </motion.div>
      </div>

      {/* Dolna sekcja z przychodami i kontami oszczędnościowymi */}
      <div className="flex flex-wrap gap-6">
        {/* Lewa kolumna z przychodami */}
        <motion.div 
          className="flex-1 min-w-[300px]"
          variants={itemVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <IncomeSection selectedMonth={selectedMonth} />
          </motion.div>
        </motion.div>

        {/* Prawa kolumna z kontami oszczędnościowymi */}
        <motion.div 
          className="flex-1 min-w-[300px]"
          variants={itemVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <SavingsAccountsSection 
              accounts={bankAccounts}
              isLoading={!bankAccountsData}
              onAddAccount={() => setShowAddAccountDialog(true)}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {showAddCategoryDialog && (
          <Dialog open={showAddCategoryDialog} onOpenChange={setShowAddCategoryDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dodaj nową kategorię</DialogTitle>
              </DialogHeader>
              <AddCategoryForm onSuccess={handleCategorySuccess} />
            </DialogContent>
          </Dialog>
        )}

        {showAddAccountDialog && (
          <Dialog open={showAddAccountDialog} onOpenChange={setShowAddAccountDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dodaj konto oszczędnościowe</DialogTitle>
              </DialogHeader>
              <AddSavingsAccountForm onSuccess={() => setShowAddAccountDialog(false)} />
            </DialogContent>
          </Dialog>
        )}

        {selectedCategory && (
          <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edytuj kategorię</DialogTitle>
              </DialogHeader>
              <EditCategoryForm 
                category={selectedCategory} 
                onSuccess={handleCategorySuccess}
              />
            </DialogContent>
          </Dialog>
        )}

        {categoryToDelete && (
          <Dialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Czy na pewno chcesz usunąć tę kategorię?</DialogTitle>
                <DialogDescription>
                  Ta operacja jest nieodwracalna. Wszystkie wydatki przypisane do tej kategorii zostaną usunięte.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCategoryToDelete(null)}
                >
                  Anuluj
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={confirmDeleteCategory}
                  disabled={deleteCategory.isPending}
                >
                  {deleteCategory.isPending ? 'Usuwanie...' : 'Usuń'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
