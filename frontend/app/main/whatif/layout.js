import FormComponent from "./edit"
import AdjustablePieChart from "./adjustableChart"
import Link from "next/link"

const AppLayout = () => {
  return (
      <>
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">What if</h1>
        <Link 
          href="/main/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </Link>
      </div>    
      <AdjustablePieChart/>
      <FormComponent />
      </>
 
)
}

export default AppLayout
