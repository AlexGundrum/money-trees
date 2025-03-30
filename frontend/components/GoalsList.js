import { fetchGoals, calculateGoalProgress } from '@/service/api';

function GoalsList() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const goalsData = await fetchGoals();
        setGoals(goalsData);
      } catch (error) {
        console.error('Failed to load goals:', error);
      }
    };
    loadGoals();
  }, []);

  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.name}</h3>
          <progress 
            value={goal.current_amount} 
            max={goal.target_amount}
          />
          <span>{calculateGoalProgress(goal.current_amount, goal.target_amount)}%</span>
        </div>
      ))}
    </div>
  );
}