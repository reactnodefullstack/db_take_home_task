import { AgGridReact, AgGridReactProps } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useEffect, useState } from 'react';
import { Country, Currency } from '../types/index'
import '../css/index.css';

interface GridContainerProps {
    countries: Country[]
}

export const GridContainer = (props:GridContainerProps) => { 
  console.log('@@@ GRIDCONTAINER render...props = ', props)   
  const { countries } = props
  const [rowData, setRowData] = useState<Country[]>();
  const [selectedRecordDisplay,setSelectedRecordDisplay] = useState<boolean>(false)

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    { field: 'flag', 
      width: 100,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      headerClass: 'text-center',
      sortable: true, 
      filter: true
    },
    { field: 'name.common', 
      sortable: true, 
      filter: true
    },
    { field: 'languages', 
      sortable: true, 
      filter: true,
      valueGetter: ({ data : { languages }}) => {
          return languages ? Object.values(languages) : ''
      } 
    },
    { field: 'currencies', 
      valueGetter: ({ data: { currencies } }) => {
          const myArray:string[] = []
          if (currencies) {
              Object.keys(currencies).forEach(function(key) {
                myArray.push(currencies[key].name)
              });
          }
          return myArray
      } 
    },
    { field: 'population',
      type: 'rightAligned',
      valueFormatter: ({data: {population}}) =>  {
        return population.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    }
  ])

  const onRowSelected = (event) => {
    console.log('@@@ event.data = ', event.data)
    setSelectedRecordDisplay(true)
  }

    return (
        <div className="ag-theme-quartz">
          <AgGridReact 
            headerHeight={50} 
            rowSelection={"single"}
            onRowSelected={onRowSelected}
            pagination={true}
            rowData={countries} 
            columnDefs={colDefs as any} />
        </div>
    );
}