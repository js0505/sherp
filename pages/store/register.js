import { useEffect, useState } from "react"
import StoreRegisterForm from "../../components/store/register-form"
import PageTitle from "../../components/ui/page-title"
import { getBrandNoneProducts } from "../../lib/util/product-util"
import { getAllUsers } from "../../lib/util/user-util"

function StoreRegisterPage() {
	const [products, setProducts] = useState()
	const [users, setUsers] = useState()

	async function getBrandNoneProductsToUtil() {
		const productList = await getBrandNoneProducts()
		setProducts(productList)
	}

	async function getAllUsersToUtil() {
		const users = await getAllUsers()
		setUsers(users)
	}

	useEffect(() => {
		getBrandNoneProductsToUtil()
		getAllUsersToUtil()
	}, [])
	return (
		<>
			<PageTitle title="가맹점 등록" />

			{products && (
				<StoreRegisterForm filteredProducts={products} users={users} />
			)}
		</>
	)
}

export default StoreRegisterPage
