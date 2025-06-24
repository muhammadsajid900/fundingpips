import { render, screen, fireEvent } from "@testing-library/react"
import { StockCard } from "@/components/stock-card"
import { useWatchlistStore } from "@/store/watchlist-store"
import type { Stock } from "@/types/stock"

// Mock the store
jest.mock("@/store/watchlist-store")
const mockUseWatchlistStore = useWatchlistStore as jest.MockedFunction<typeof useWatchlistStore>

const mockStock: Stock = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 175.5,
  change: 2.5,
  changePercent: 1.45,
  volume: 50000000,
  exchange: "NASDAQ",
}

describe("StockCard", () => {
  const mockAddToWatchlist = jest.fn()
  const mockIsInWatchlist = jest.fn()

  beforeEach(() => {
    mockUseWatchlistStore.mockReturnValue({
      watchlist: [],
      addToWatchlist: mockAddToWatchlist,
      removeFromWatchlist: jest.fn(),
      clearWatchlist: jest.fn(),
      isInWatchlist: mockIsInWatchlist,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders stock information correctly", () => {
    mockIsInWatchlist.mockReturnValue(false)

    render(<StockCard stock={mockStock} showAddToWatchlist />)

    expect(screen.getByText("AAPL")).toBeInTheDocument()
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument()
    expect(screen.getByText("$175.50")).toBeInTheDocument()
    expect(screen.getByText("$2.50 (1.45%)")).toBeInTheDocument()
    expect(screen.getByText("Volume: 50,000,000")).toBeInTheDocument()
  })

  it("shows positive change with green color and trending up icon", () => {
    mockIsInWatchlist.mockReturnValue(false)

    render(<StockCard stock={mockStock} showAddToWatchlist />)

    const changeElement = screen.getByText("$2.50 (1.45%)")
    expect(changeElement).toHaveClass("text-green-600")
  })

  it("shows negative change with red color and trending down icon", () => {
    const negativeStock = { ...mockStock, change: -2.5, changePercent: -1.45 }
    mockIsInWatchlist.mockReturnValue(false)

    render(<StockCard stock={negativeStock} showAddToWatchlist />)

    const changeElement = screen.getByText("$2.50 (1.45%)")
    expect(changeElement).toHaveClass("text-red-600")
  })

  it("allows adding to watchlist when not already added", async () => {
    mockIsInWatchlist.mockReturnValue(false)

    render(<StockCard stock={mockStock} showAddToWatchlist />)

    const addButton = screen.getByRole("button")
    fireEvent.click(addButton)

    expect(mockAddToWatchlist).toHaveBeenCalledWith("AAPL")
  })

  it("shows added state when stock is in watchlist", () => {
    mockIsInWatchlist.mockReturnValue(true)

    render(<StockCard stock={mockStock} showAddToWatchlist />)

    expect(screen.getByText("✓ Added")).toBeInTheDocument()
  })

  it("calls onRemove when remove button is clicked", () => {
    const mockOnRemove = jest.fn()
    mockIsInWatchlist.mockReturnValue(true)

    render(<StockCard stock={mockStock} showRemoveFromWatchlist onRemove={mockOnRemove} />)

    const removeButton = screen.getByRole("button")
    fireEvent.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalled()
  })
})
