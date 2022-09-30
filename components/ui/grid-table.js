import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

function GridTable(props) {
	const { columnDefs, rowData, onGridReady, onCellClicked } = props
	return (
		<>
			<div className="h-96 mt-5 mb-3 lg:h-[29rem]">
				<div className="ag-theme-alpine w-full h-full">
					<AgGridReact
						defaultColDef={{
							sortable: true,
						}}
						columnDefs={columnDefs}
						rowData={rowData}
						onGridReady={onGridReady}
						onCellClicked={onCellClicked}
					/>
				</div>
			</div>
		</>
	)
}

export default GridTable
